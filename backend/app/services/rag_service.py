from typing import List, Dict, Optional
import uuid
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Milvus
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from pymilvus import connections, utility, Collection, CollectionSchema, FieldSchema, DataType

from app.config import settings


class RAGService:
    """Service for RAG operations using LangChain, Milvus, and OpenAI."""

    def __init__(self):
        """Initialize RAG service with embeddings, vector store, and LLM."""
        # Initialize OpenAI embeddings (한국어 지원)
        self.embeddings = OpenAIEmbeddings(
            model=settings.embedding_model,
            openai_api_key=settings.openai_api_key
        )

        # Initialize Milvus connection
        connections.connect(
            alias="default",
            host=settings.milvus_host,
            port=settings.milvus_port
        )

        # Initialize collection if not exists
        self._initialize_collection()

        # Initialize LangChain Milvus vector store
        self.vector_store = Milvus(
            embedding_function=self.embeddings,
            collection_name=settings.milvus_collection_name,
            connection_args={
                "host": settings.milvus_host,
                "port": settings.milvus_port
            }
        )

        # Initialize LLM (한국어 지원)
        self.llm = ChatOpenAI(
            model=settings.llm_model,
            temperature=settings.llm_temperature,
            openai_api_key=settings.openai_api_key
        )

        # Text splitter for document chunking (한국어 최적화)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        # Korean-optimized prompt template
        self.prompt_template = PromptTemplate(
            template="""당신은 한국어를 이해하는 AI 어시스턴트입니다. 주어진 문맥을 바탕으로 질문에 답변해주세요.

문맥:
{context}

질문: {question}

답변은 한국어로 제공하며, 문맥에 없는 내용은 추측하지 말고 "주어진 정보로는 답변할 수 없습니다"라고 말해주세요.

답변:""",
            input_variables=["context", "question"]
        )

    def _initialize_collection(self):
        """Initialize Milvus collection if it doesn't exist."""
        try:
            collection_name = settings.milvus_collection_name

            # Check if collection exists
            if not utility.has_collection(collection_name):
                # Define schema for the collection
                fields = [
                    FieldSchema(name="pk", dtype=DataType.VARCHAR, is_primary=True, max_length=100),
                    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
                    FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=1536)
                ]
                schema = CollectionSchema(fields=fields, description="RAG documents collection")

                # Create collection
                collection = Collection(name=collection_name, schema=schema)

                # Create IVF_FLAT index for vector field
                index_params = {
                    "metric_type": "L2",
                    "index_type": "IVF_FLAT",
                    "params": {"nlist": 1024}
                }
                collection.create_index(field_name="vector", index_params=index_params)

                print(f"Created collection: {collection_name}")
        except Exception as e:
            print(f"Error initializing collection: {e}")

    async def upload_document(
        self,
        text: str,
        metadata: Optional[Dict] = None
    ) -> str:
        """
        Upload and index a document.
        Args:
            text: Document text (supports Korean)
            metadata: Optional metadata for the document

        Returns:
            Document ID
        """
        # Generate unique document ID
        doc_id = str(uuid.uuid4())

        # Split text into chunks
        chunks = self.text_splitter.split_text(text)

        # Prepare metadata for each chunk
        chunk_metadata = metadata or {}
        chunk_metadata["document_id"] = doc_id

        # Add documents to vector store
        texts_with_metadata = [
            (chunk, {**chunk_metadata, "chunk_index": i})
            for i, chunk in enumerate(chunks)
        ]

        texts = [text for text, _ in texts_with_metadata]
        metadatas = [meta for _, meta in texts_with_metadata]

        self.vector_store.add_texts(texts=texts, metadatas=metadatas)

        return doc_id

    async def query(
        self,
        query: str,
        top_k: int = 3
    ) -> Dict:
        """
        Query the RAG system.

        Args:
            query: User query (supports Korean)
            top_k: Number of relevant documents to retrieve

        Returns:
            Dictionary with answer and sources
        """
        # Create retrieval QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(
                search_kwargs={"k": top_k}
            ),
            return_source_documents=True,
            chain_type_kwargs={"prompt": self.prompt_template}
        )

        # Execute query
        result = await qa_chain.ainvoke({"query": query})

        # Format response
        sources = []
        for doc in result.get("source_documents", []):
            sources.append({
                "content": doc.page_content,
                "metadata": doc.metadata
            })

        return {
            "answer": result["result"],
            "sources": sources
        }

    async def delete_collection(self):
        """Delete the entire collection (useful for testing/reset)."""
        collection_name = settings.milvus_collection_name
        if utility.has_collection(collection_name):
            utility.drop_collection(collection_name)
        self._initialize_collection()


# Singleton instance
rag_service = RAGService()

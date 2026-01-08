from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    DocumentUploadRequest,
    DocumentUploadResponse,
    QueryRequest,
    QueryResponse,
    HealthResponse
)
from app.services.rag_service import rag_service
from app import __version__

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        version=__version__
    )


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(request: DocumentUploadRequest):
    """
    Upload and index a document.

    Supports Korean text.
    """
    try:
        doc_id = await rag_service.upload_document(
            text=request.text,
            metadata=request.metadata
        )
        return DocumentUploadResponse(
            success=True,
            document_id=doc_id,
            message="문서가 성공적으로 업로드되었습니다."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"문서 업로드 중 오류가 발생했습니다: {str(e)}"
        )


@router.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Query the RAG system.

    Supports Korean queries.
    """
    try:
        result = await rag_service.query(
            query=request.query,
            top_k=request.top_k
        )
        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"쿼리 처리 중 오류가 발생했습니다: {str(e)}"
        )


@router.delete("/collection")
async def delete_collection():
    """
    Delete entire collection (useful for testing/reset).

    WARNING: This will delete all indexed documents.
    """
    try:
        await rag_service.delete_collection()
        return {"message": "컬렉션이 성공적으로 삭제되었습니다."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"컬렉션 삭제 중 오류가 발생했습니다: {str(e)}"
        )

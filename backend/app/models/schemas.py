from pydantic import BaseModel, Field
from typing import List, Optional


class DocumentUploadRequest(BaseModel):
    """Request model for uploading documents."""
    text: str = Field(..., description="Document text to be indexed")
    metadata: Optional[dict] = Field(default=None, description="Optional metadata for the document")


class DocumentUploadResponse(BaseModel):
    """Response model for document upload."""
    success: bool
    document_id: str
    message: str


class QueryRequest(BaseModel):
    """Request model for RAG queries."""
    query: str = Field(..., description="User query in Korean or English")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of relevant documents to retrieve")


class QueryResponse(BaseModel):
    """Response model for RAG queries."""
    answer: str = Field(..., description="Generated answer from RAG")
    sources: List[dict] = Field(default_factory=list, description="Retrieved source documents")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app import __version__

# Create FastAPI application
app = FastAPI(
    title="RAG API",
    description="RAG application using LangChain, Qdrant, and OpenAI with Korean language support",
    version=__version__
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["RAG"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "RAG API is running",
        "version": __version__,
        "docs": "/docs"
    }

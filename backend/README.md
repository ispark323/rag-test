# RAG Project

Python 기반의 RAG (Retrieval-Augmented Generation) 프로젝트입니다. LangChain, Qdrant, OpenAI를 사용하여 한국어를 지원합니다.

## 기술 스택

- **Language**: Python 3.11
- **API Framework**: FastAPI
- **RAG Framework**: LangChain
- **Vector Database**: Qdrant
- **LLM**: OpenAI (GPT-4)
- **Embeddings**: OpenAI text-embedding-3-small
- **Package Manager**: UV

## 프로젝트 구조

```
.
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 애플리케이션
│   ├── config.py            # 환경 설정
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API 엔드포인트
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic 모델
│   └── services/
│       ├── __init__.py
│       └── rag_service.py   # RAG 핵심 로직
├── data/
│   └── documents/           # 문서 저장 디렉토리
├── pyproject.toml           # UV 의존성 설정
├── .env.example             # 환경 변수 예시
├── .gitignore
└── README.md
```

## 설치 및 실행

### 1. UV 설치

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. 프로젝트 설정

```bash
# 의존성 설치
uv sync

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 OPENAI_API_KEY를 설정하세요
```

### 3. Qdrant 실행

Docker를 사용하여 Qdrant를 실행합니다:

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

### 4. 애플리케이션 실행

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API 문서는 http://localhost:8000/docs 에서 확인할 수 있습니다.

## API 엔드포인트

### Health Check

```bash
GET /health
```

### 문서 업로드

```bash
POST /api/v1/documents/upload
Content-Type: application/json

{
  "text": "업로드할 문서 내용",
  "metadata": {
    "source": "example.pdf",
    "author": "홍길동"
  }
}
```

### 쿼리 (RAG)

```bash
POST /api/v1/query
Content-Type: application/json

{
  "query": "질문 내용을 입력하세요",
  "top_k": 3
}
```

### 컬렉션 삭제

```bash
DELETE /api/v1/collection
```

## 사용 예시

### Python 클라이언트

```python
import httpx

# 문서 업로드
response = httpx.post(
    "http://localhost:8000/api/v1/documents/upload",
    json={
        "text": "안녕하세요. 이것은 테스트 문서입니다.",
        "metadata": {"source": "test"}
    }
)
print(response.json())

# 쿼리
response = httpx.post(
    "http://localhost:8000/api/v1/query",
    json={
        "query": "테스트 문서에 대해 알려주세요",
        "top_k": 3
    }
)
print(response.json())
```

### cURL

```bash
# 문서 업로드
curl -X POST "http://localhost:8000/api/v1/documents/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "안녕하세요. 이것은 테스트 문서입니다.",
    "metadata": {"source": "test"}
  }'

# 쿼리
curl -X POST "http://localhost:8000/api/v1/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "테스트 문서에 대해 알려주세요",
    "top_k": 3
  }'
```

## 환경 변수

`.env` 파일에서 다음 환경 변수를 설정할 수 있습니다:

- `OPENAI_API_KEY`: OpenAI API 키 (필수)
- `QDRANT_HOST`: Qdrant 호스트 (기본값: localhost)
- `QDRANT_PORT`: Qdrant 포트 (기본값: 6333)
- `QDRANT_COLLECTION_NAME`: 컬렉션 이름 (기본값: rag_documents)
- `EMBEDDING_MODEL`: 임베딩 모델 (기본값: text-embedding-3-small)
- `LLM_MODEL`: LLM 모델 (기본값: gpt-4-turbo-preview)
- `LLM_TEMPERATURE`: LLM temperature (기본값: 0.7)

## 개발

### 코드 포맷팅

```bash
uv run black app/
uv run ruff check app/
```

### 테스트

```bash
uv run pytest
```

## 한국어 지원

이 프로젝트는 한국어를 완벽하게 지원합니다:
- 한국어 문서 임베딩
- 한국어 질의 처리
- 한국어 답변 생성
- 한국어 최적화된 텍스트 분할

## 라이선스

MIT License

# RAG Application Monorepo

LangChain, Qdrant, OpenAI를 활용한 한국어 지원 RAG 시스템 (모노레포)

## 프로젝트 구조

```
rag/
├── backend/          # FastAPI 백엔드
│   ├── app/
│   │   ├── api/      # API 라우트
│   │   ├── models/   # 데이터 모델
│   │   ├── services/ # 비즈니스 로직
│   │   └── main.py   # 애플리케이션 엔트리포인트
│   └── requirements.txt
├── frontend/         # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── components/ # React 컴포넌트
│   │   └── lib/      # 유틸리티 및 API 클라이언트
│   └── package.json
├── docker-compose.yml
└── package.json      # 모노레포 루트
```

## 기능

- 📄 문서 업로드 및 벡터 인덱싱
- 🔍 의미 기반 문서 검색
- 🤖 GPT를 활용한 답변 생성
- 🌐 한국어 및 영어 지원
- 🎨 모던한 UI/UX (Shadcn UI)

## 시작하기

### 사전 요구사항

- Python 3.9+
- Node.js 18.17+
- Docker & Docker Compose (선택사항)
- OpenAI API Key

### 환경 변수 설정

#### 백엔드 (.env)

`backend/.env` 파일을 생성하고 다음 내용을 추가:

```env
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

#### 프론트엔드 (.env.local)

`frontend/.env.local` 파일을 생성하고 다음 내용을 추가:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 설치

#### 전체 설치

```bash
npm run install:all
```

#### 개별 설치

```bash
# 백엔드
npm run install:backend

# 프론트엔드
npm run install:frontend
```

### 실행

#### Docker Compose로 실행 (권장)

```bash
docker-compose up -d
```

- 백엔드: http://localhost:8000
- 프론트엔드: http://localhost:3000
- Qdrant: http://localhost:6333
- API 문서: http://localhost:8000/docs

#### 개발 모드 (로컬)

##### 1. Qdrant 실행

```bash
docker run -d -p 6333:6333 qdrant/qdrant
```

##### 2. 백엔드와 프론트엔드 동시 실행

```bash
npm run dev
```

또는 개별 실행:

```bash
# 백엔드
npm run dev:backend

# 프론트엔드
npm run dev:frontend
```

## API 엔드포인트

### Health Check
```
GET /api/v1/health
```

### 문서 업로드
```
POST /api/v1/documents/upload
{
  "text": "문서 내용",
  "metadata": {}
}
```

### RAG 쿼리
```
POST /api/v1/query
{
  "query": "질문",
  "top_k": 3
}
```

### 컬렉션 삭제
```
DELETE /api/v1/collection
```

## 기술 스택

### 백엔드
- **Framework**: FastAPI
- **Vector DB**: Qdrant
- **LLM**: OpenAI GPT
- **Embeddings**: OpenAI Embeddings
- **RAG Framework**: LangChain

### 프론트엔드
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

## 개발 가이드

### 백엔드 개발

```bash
cd backend
source venv/bin/activate  # 가상환경 활성화
uvicorn app.main:app --reload
```

### 프론트엔드 개발

```bash
cd frontend
npm run dev
```

### 테스트

```bash
# 백엔드 테스트
cd backend
pytest

# 프론트엔드 빌드 테스트
cd frontend
npm run build
```

## 프로젝트 관리

이 프로젝트는 npm workspaces를 사용하는 모노레포입니다.

### 의존성 추가

```bash
# 루트 레벨 의존성
npm install -D <package>

# 프론트엔드 의존성
cd frontend && npm install <package>

# 백엔드 의존성
cd backend && pip install <package>
cd backend && pip freeze > requirements.txt
```

### 워크스페이스 명령어

```bash
# 모든 워크스페이스에서 스크립트 실행
npm run <script> --workspaces

# 특정 워크스페이스에서 실행
npm run <script> --workspace=frontend
```

## Docker 빌드

### 개별 빌드

```bash
# 백엔드
docker build -t rag-backend ./backend

# 프론트엔드
docker build -t rag-frontend ./frontend
```

### Compose로 빌드

```bash
docker-compose build
```

## 라이선스

ISC

## 기여

이슈나 PR은 언제든 환영합니다!

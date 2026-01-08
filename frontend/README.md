# RAG Frontend

Next.js, Tailwind CSS, Shadcn UI를 사용한 RAG 애플리케이션 프론트엔드

## 기능

- 📄 문서 업로드 및 인덱싱
- 🔍 RAG 기반 질의응답
- 🎨 Shadcn UI를 활용한 모던한 UI
- 🌐 한국어 및 영어 지원
- 🗑️ 컬렉션 삭제 기능

## 시작하기

### 사전 요구사항

- Node.js 18.17 이상
- 백엔드 API 서버 실행 중 (기본: http://localhost:8000)

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   ├── page.tsx        # 메인 페이지
│   │   └── globals.css     # 글로벌 스타일
│   ├── components/
│   │   ├── ui/             # Shadcn UI 컴포넌트
│   │   ├── document-upload.tsx  # 문서 업로드 컴포넌트
│   │   └── rag-query.tsx   # RAG 질의 컴포넌트
│   └── lib/
│       ├── api.ts          # API 클라이언트
│       └── utils.ts        # 유틸리티 함수
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 사용 방법

1. **문서 업로드**: 왼쪽 패널에서 문서 내용을 입력하고 "문서 업로드" 버튼을 클릭
2. **질의하기**: 오른쪽 패널에서 질문을 입력하고 "질의하기" 버튼을 클릭
3. **결과 확인**: AI가 생성한 답변과 참고한 문서들을 확인

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## 라이선스

ISC

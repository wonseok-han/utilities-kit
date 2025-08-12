# Dev Kit App

Utilities Kit의 메인 개발 도구 애플리케이션입니다.

## 🚀 Quick Start

```bash
# 개발 서버 시작
pnpm run dev

# 또는 모노레포 전체와 함께 실행
pnpm run dev:kit
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 결과를 확인하세요.

## 📱 구현된 도구들

### 🔧 개발 도구

- **JSON Formatter**: JSON 데이터 포맷팅 및 검증
- **Base64 Encoder/Decoder**: Base64 인코딩/디코딩
- **JWT Encoder/Decoder**: JWT 토큰 디코딩 및 검증
- **Regex Tester**: 정규식 테스트 및 유효성 검사
- **Timestamp Converter**: Unix timestamp ↔ 날짜 변환
- **Diff Comparator**: 텍스트 차이점 비교 및 하이라이팅
- **Web Editor**: 실시간 HTML 에디터 (TipTap 기반)
- **CVE Viewer**: NVD API를 통한 CVE 데이터 조회

## 🛠️ 개발 환경

### 스크립트

```bash
# 개발 서버 (포트 3001)
pnpm run dev

# 빌드
pnpm run build

# 프로덕션 서버
pnpm run start

# 린팅
pnpm run lint

# 타입 체크
pnpm run check-types
```

### 자동 인덱스 생성

이 앱은 `@repo/auto-index` 패키지를 사용하여 다음 파일들을 자동으로 생성합니다:

- `src/components/index.ts`
- `src/hooks/index.ts`
- `src/store/index.ts`
- `public/assets/icons/index.ts`

## 📁 앱 구조

```
src/
├── app/                    # App Router 페이지들
│   ├── json-formatter/     # JSON 포맷터
│   ├── base64-encoder/     # Base64 인코더
│   ├── jwt-encoder/        # JWT 인코더
│   ├── regex-tester/       # 정규식 테스터
│   ├── timestamp-converter/ # 타임스탬프 변환기
│   ├── diff/               # Diff 비교기
│   ├── web-editor/         # 웹 에디터
│   ├── cve-viewer/         # CVE 뷰어
│   └── api/                # API 라우트
├── components/             # 공통 컴포넌트
│   ├── sidebar/           # 사이드바 컴포넌트
│   ├── header.tsx         # 헤더 컴포넌트
│   └── page-wrapper.tsx   # 페이지 래퍼
├── store/                 # Zustand 스토어
│   ├── cve-store.ts       # CVE 데이터 스토어
│   ├── json-store.ts      # JSON 포맷터 스토어
│   └── ...                # 기타 스토어들
├── hooks/                 # 커스텀 훅
│   ├── use-infinite-scroll.ts
│   └── use-media-query.ts
├── types/                 # 타입 정의
└── constants/             # 상수 정의
    └── menu.ts           # 메뉴 아이템 정의
```

## 🔧 기술 스택

- **Next.js 15.3.0**: App Router 기반 React 프레임워크
- **React 19.1.0**: 최신 React 버전
- **TypeScript 5.8.2**: 정적 타입 검사
- **Tailwind CSS 4.1.11**: 유틸리티 퍼스트 CSS
- **Zustand 5.0.6**: 경량 상태 관리
- **TipTap**: 리치 텍스트 에디터
- **Monaco Editor**: 코드 에디터

## 📝 주요 기능 상세

### CVE Viewer

- NVD API를 통한 실시간 CVE 데이터 조회
- 무한스크롤을 통한 효율적인 데이터 로딩
- 역순 페이지네이션으로 최신 데이터부터 표시

### Web Editor

- TipTap 기반의 리치 텍스트 에디터
- 실시간 HTML 미리보기
- 마크다운 지원
- 커스텀 툴바 및 단축키

### JSON Formatter

- JSON 데이터 자동 포맷팅
- 구문 오류 검증
- 압축/확장 토글 기능
- 복사 기능

## 🔗 관련 링크

- [프로젝트 전체 README](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [TipTap Editor](https://tiptap.dev/docs/editor/getting-started/install/react)

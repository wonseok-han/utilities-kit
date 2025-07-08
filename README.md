# Utilities Kit

- 그 때마다 이곳저곳 찾아서 쓰기 귀찮아서 내가 한꺼번에 모아놓은 나만의 Dev Tools 토이 프로젝트

## 📋 목차

- [개발 환경 (예정)](#📦-개발-환경-(예정))
- [Plan (추가할 기능)](#Plan-(추가할-기능))
- [Getting Started](#🚀-Getting-Started)
- [프로젝트 구조](#📁-프로젝트-구조)

## 📦 개발 환경 (예정)

| 항목              | 내용                                     |
| ----------------- | ---------------------------------------- |
| **Node.js**       | `v22.17.0` (LTS)                         |
| **패키지 매니저** | `pnpm`                                   |
| **모노레포 도구** | `TurboRepo`                              |
| **프레임워크**    | `Next.js` (App Router 기반 예정)         |
| **스타일링**      | `Tailwind CSS` + `shadcn/ui` (사용 예정) |

## 📋 Plan (추가할 기능)

- [ ] `웹에디터`: 개발 중인 사이트에 매번 추가 개발건으로 누락되어서 기능은 없고, 매번 따로 작성해서 html 변환 후 DB에 수동으로 저장해줘야하는 슬픔을 달래주기 위한 기능
- [ ] `JWT En/Decoder`: JWT를 사용 중인 개발 중 사이트에서 토큰 문제인가????? 싶은 에러가 자주 발생해서 매번 jwt 사이트 찾아가서 풀어헤쳐 만료여서 그런가?에 대한 의문을 풀어주기 위한 기능
- [ ] `Timestamp Converter`: 풀어헤쳐 나온 만료일시 timestamp를 또 변환 사이트 찾아가서 변환해서 아 이때까지구나라는걸 확인하는게 귀찮아서 포함시킬 기능
- [ ] `Base64 En/Decoder`: 이거도 생각보다 많이 써서 포함시킬 기능
- [ ] `정규식 테스트`: 유효성 검사를 도와줄 정규식 테스트 기능
- [ ] `타입 생성기`: Backend API 응답값에서 key-value 추출해서 적절한 타입으로 만들어주는 기능
- [ ] `릴리즈 노트 포맷 생성기`: 텍스트만 입력하면 뾰로롱 마크다운 템플릿으로 변환해줄 내 귀찮음을 덜어줄 기능
- [ ] `Diff 비교기`: 두 텍스트를 비교해서 변경된 라인만 하이라이팅하는 은근 국밥같은 기능
- [ ] `StorageViewer`: 로컬스토리지, 세션스토리지 등 스토리지에서 key-value 읽어서 복사하기 쉽게 만들어줄 기능
- [ ] `JSON Formatter`: JSON을 입력받아 정렬해주는 기능

## 🚀 Getting Started

```bash
# Module Install
pnpm install

# Server start
pnpm run dev
```

## 📁 프로젝트 구조

```bash
utilities-kit/
├── apps/                   # 애플리케이션 디렉토리
│   └── dev-tools/          # Next.js 개발 도구 앱
├── packages/               # 공유 패키지 디렉토리
│   ├── eslint-config/      # ESLint 설정 패키지
│   ├── typescript-config/  # TypeScript 설정 패키지
│   └── ui/                 # UI 컴포넌트 패키지
├── docs/                   # 문서 디렉토리
├── turbo.json              # Turborepo 설정 파일
└── pnpm-workspace.yaml     # pnpm 워크스페이스 설정
```

## Reference

- https://turborepo.com/docs/guides/tools/tailwind

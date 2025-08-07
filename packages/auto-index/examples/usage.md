# Auto Index 사용 예시

## 1. 패키지 설치

```bash
pnpm add @repo/auto-index
```

## 2. CLI 사용법

### 단일 폴더 처리

```bash
# 기본 사용법
npx auto-index src/components

# 출력 경로 지정
npx auto-index src/components src/components/index.ts

# workspace에서 사용
pnpm exec auto-index src/components
```

### 다중 폴더 및 패턴 처리

```bash
# 여러 폴더 동시 처리
npx auto-index-watch-all src/components src/hooks

# glob 패턴 사용
npx auto-index-watch-all "src/**/components" "src/**/hooks"

# 혼합 사용
npx auto-index-watch-all src/components "src/app/**/components" "packages/**/utils"
```

## 3. 프로그래밍 방식 사용

```typescript
import { generateIndex, AutoIndexWatcher } from '@repo/auto-index';

// 한 번만 생성
generateIndex('./src/components');

// 자동 감지 모드
const watcher = new AutoIndexWatcher('./src/components');
watcher.start();

// 나중에 중지
watcher.stop();
```

## 4. package.json 스크립트 추가

```json
{
  "scripts": {
    "generate:index": "auto-index src/components",
    "dev:watch": "auto-index-watch-all",
    "dev": "concurrently \"next dev\" \"auto-index-watch-all\""
  },
  "autoIndex": {
    "exclude": [
      "node_modules",
      "dist",
      ".git",
      ".next"
    ],
    "watchTargets": [
      {
        "watchPaths": [
          "src/components",
          "src/app/**/components"
        ],
        "fileExtensions": [
          ".tsx",
          ".ts",
          ".jsx",
          ".js"
        ],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "pascalCase"
      },
      {
        "watchPaths": [
          "src/hooks"
        ],
        "fileExtensions": [
          ".tsx",
          ".ts",
          ".jsx",
          ".js"
        ],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "camelCase"
      }
    ]
  }
}
```

## 5. 실제 예시

### 컴포넌트 폴더 구조
```
src/components/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
└── index.ts (자동 생성)
```

### Button.tsx
```typescript
export const Button = ({ children }: { children: React.ReactNode }) => {
  return <button>{children}</button>;
};
```

### Input.tsx
```typescript
export function Input({ placeholder }: { placeholder: string }) {
  return <input placeholder={placeholder} />;
}
```

### Modal.tsx
```typescript
export default function Modal({ isOpen }: { isOpen: boolean }) {
  return isOpen ? <div>Modal</div> : null;
}
```

### 생성되는 index.ts
```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

## 6. Glob 패턴 사용 예시

### 다양한 폴더 구조 처리

```bash
# 모든 components 폴더 처리
auto-index-watch-all "src/**/components"

# 모든 hooks 폴더 처리
auto-index-watch-all "src/**/hooks"

# 모든 utils 폴더 처리
auto-index-watch-all "packages/**/utils"

# 여러 패턴 조합
auto-index-watch-all "src/**/components" "src/**/hooks" "packages/**/shared"
```

### 폴더 구조 예시
```
src/
├── components/
│   ├── Button.tsx
│   └── index.ts
├── app/
│   ├── page1/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   └── page2/
│       ├── components/
│       │   ├── Footer.tsx
│       │   └── index.ts
└── hooks/
    ├── useAuth.ts
    └── index.ts
```

위 구조에서 `auto-index-watch-all "src/**/components" "src/**/hooks"`를 실행하면:
- `src/components/index.ts`
- `src/app/page1/components/index.ts`
- `src/app/page2/components/index.ts`
- `src/hooks/index.ts`

모두 자동으로 생성됩니다.

## 7. 네이밍 규칙 예시

### 파일명 변환 예시

**파일명**: `user-profile.tsx`

| namingConvention | 결과 | 설명 |
|------------------|------|------|
| `original` | `user_profile` | 기본값, 원본 파일명 유지 |
| `pascalCase` | `UserProfile` | React 컴포넌트용 |
| `camelCase` | `userProfile` | 유틸리티 함수용 |

### 실제 변환 예시

**파일명**: `base64-encoder-header.tsx`

```typescript
// namingConvention: "original" (기본값)
export { default as base64_encoder_header } from './base64-encoder-header';

// namingConvention: "pascalCase"
export { default as Base64EncoderHeader } from './base64-encoder-header';

// namingConvention: "camelCase"  
export { default as base64EncoderHeader } from './base64-encoder-header';
```

## 8. 경로별 설정 예시

### 경로별 네이밍 규칙 적용

```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": [
          "src/**/components",
          "src/app/**/components"
        ],
        "namingConvention": "pascalCase",
        "exportStyle": "named"
      },
      {
        "watchPaths": [
          "src/**/hooks"
        ],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      },
      {
        "watchPaths": [
          "src/**/utils"
        ],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

### 결과 예시

**src/components/UserProfile.tsx**:
```typescript
// namingConvention: "pascalCase" 적용
export { default as UserProfile } from './UserProfile';
```

**src/hooks/useAuth.ts**:
```typescript
// namingConvention: "camelCase" 적용
export { default as useAuth } from './useAuth';
```

**src/utils/dateHelper.ts**:
```typescript
// namingConvention: "camelCase" 적용
export { default as dateHelper } from './dateHelper';
```

## 9. 지원하는 Export 패턴

### Named Export
```typescript
export const Component = () => {};
export function Component() {}
export class Component {}
```

### Default Export
```typescript
export default Component;
const Component = () => {};
export default Component;
```

### Export Block
```typescript
export { Component1, Component2 };
export { Component as NewName };
```

### Mixed Export
```typescript
export const Component1 = () => {};
export default Component2;
export { Component3 };
```

## 10. 개발 환경 설정

### Next.js 프로젝트

```json
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"auto-index-watch-all\"",
    "build": "auto-index src/components && next build"
  },
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": [
          "src/components",
          "src/app/**/components"
        ],
        "namingConvention": "pascalCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

### React 프로젝트

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"auto-index-watch-all\"",
    "build": "auto-index src/components && vite build"
  },
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/components"],
        "fileExtensions": [".tsx", ".ts"],
        "namingConvention": "pascalCase"
      }
    ]
  }
}
```

### 유틸리티 라이브러리

```json
{
  "scripts": {
    "dev": "auto-index-watch-all",
    "build": "auto-index src/utils && tsc"
  },
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/utils"],
        "fileExtensions": [".ts", ".js"],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

## 11. 고급 설정 예시

### 컴포넌트 전용 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/components"],
        "fileExtensions": [".tsx", ".ts"],
        "namingConvention": "pascalCase",
        "exportStyle": "named",
        "exclude": ["node_modules", "dist", ".next", ".turbo"]
      }
    ]
  }
}
```

### 훅 전용 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/hooks"],
        "fileExtensions": [".ts", ".tsx"],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

### 유틸리티 전용 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/utils", "packages/**/utils"],
        "fileExtensions": [".ts", ".js"],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

### 경로별 복합 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": [
          "src/**/components",
          "src/**/hooks",
          "src/**/utils",
          "packages/**/components"
        ],
        "namingConvention": "original"
      },
      {
        "watchPaths": [
          "src/**/components"
        ],
        "namingConvention": "pascalCase",
        "exportStyle": "named"
      },
      {
        "watchPaths": [
          "src/**/hooks"
        ],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      },
      {
        "watchPaths": [
          "src/**/utils"
        ],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      },
      {
        "watchPaths": [
          "packages/**/components"
        ],
        "namingConvention": "pascalCase",
        "exportStyle": "named",
        "fileExtensions": [".tsx", ".ts"]
      }
    ]
  }
}
```

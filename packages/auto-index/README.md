# @repo/auto-index

폴더를 자동으로 스캔하여 `index.ts` 파일을 생성하는 범용 도구입니다.

## 🚀 빠른 시작

```bash
# 패키지 설치
pnpm add @repo/auto-index

# CLI 사용 (단일 폴더)
npx auto-index src/components

# CLI 사용 (glob 패턴)
npx auto-index-watch-all src/components "src/app/**/components"
```

## 설치

```bash
pnpm add @repo/auto-index
```

## 사용법

### 1. 단일 폴더 처리

```bash
# 기본 사용법
auto-index src/components

# 출력 경로 지정
auto-index src/components src/components/index.ts
```

### 2. 다중 폴더 및 패턴 처리

```bash
# 여러 폴더 동시 처리
auto-index-watch-all src/components src/hooks

# glob 패턴 사용
auto-index-watch-all "src/**/components" "src/**/hooks"

# 혼합 사용
auto-index-watch-all src/components "src/app/**/components" "packages/**/utils"
```

### 3. 프로그래밍 방식 사용

```typescript
import { generateIndex } from '@repo/auto-index';

// 컴포넌트 폴더의 index.ts 파일 생성
generateIndex('./src/components');
```

### 4. 자동 감지 모드 (파일 변경 시 자동 업데이트)

```typescript
import { AutoIndexWatcher } from '@repo/auto-index';

// 파일 변경 감지 시작
const watcher = new AutoIndexWatcher('./src/components');
watcher.start();

// 감지 중지
watcher.stop();
```

### 5. 한 번만 생성

```typescript
import { AutoIndexWatcher } from '@repo/auto-index';

// 한 번만 index.ts 생성
AutoIndexWatcher.generateOnce('./src/components');
```

## 지원하는 Export 패턴

다음과 같은 export 패턴을 자동으로 감지합니다:

```typescript
// 1. export default
export default MyComponent;

// 2. named export
export const MyComponent = () => {};

// 3. export function
export function MyComponent() {}

// 4. export class
export class MyComponent {}

// 5. export { ... }
export { MyComponent, AnotherComponent };
```

## Glob 패턴 지원

다양한 폴더 구조를 패턴으로 처리할 수 있습니다:

```bash
# 모든 components 폴더
auto-index-watch-all "src/**/components"

# 모든 hooks 폴더
auto-index-watch-all "src/**/hooks"

# 모든 utils 폴더
auto-index-watch-all "packages/**/utils"

# 여러 패턴 조합
auto-index-watch-all "src/**/components" "src/**/hooks" "packages/**/shared"
```

## 설정 옵션

### package.json 설정

`package.json`에 `autoIndex` 필드를 추가하여 설정을 관리할 수 있습니다:

```json
{
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

### 설정 옵션 설명

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `exclude` | `string[]` | `["node_modules", "dist", ".git"]` | 제외할 폴더들 |
| `watchTargets` | `WatchTarget[]` | - | 감시할 타겟들 |

### WatchTarget 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `watchPaths` | `string[]` | - | 감시할 경로들 (glob 패턴 지원) |
| `fileExtensions` | `string[]` | `[".tsx", ".ts", ".jsx", ".js"]` | 처리할 파일 확장자 |
| `outputFile` | `string` | `"index.ts"` | 생성할 파일명 |
| `exportStyle` | `"named" \| "default"` | `"named"` | export 처리 방식 |
| `namingConvention` | `"pascalCase" \| "camelCase" \| "original"` | `"original"` | 네이밍 변환 규칙 |

### 네이밍 규칙 예시

**파일명**: `user-profile.tsx`

| namingConvention | 결과 | 설명 |
|------------------|------|------|
| `original` | `user_profile` | 기본값, 원본 파일명 유지 |
| `pascalCase` | `UserProfile` | React 컴포넌트용 |
| `camelCase` | `userProfile` | 유틸리티 함수용 |

## 예시

### 컴포넌트 폴더 구조
```
src/components/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
└── index.ts (자동 생성됨)
```

### 생성되는 index.ts
```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

## 설정

### package.json에 스크립트 추가

```json
{
  "scripts": {
    "generate:index": "auto-index src/components",
    "dev": "concurrently \"next dev\" \"auto-index-watch-all\""
  },
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": [
          "src/components",
          "src/app/**/components"
        ]
      }
    ]
  }
}
```

### 개발 중 자동 감지

```json
{
  "scripts": {
    "dev:watch": "auto-index-watch-all"
  },
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": [
          "src/**/components",
          "src/**/hooks"
        ]
      }
    ]
  }
}
```

## CLI 명령어

### auto-index
단일 폴더를 처리합니다.

```bash
auto-index <folder-path> [output-path]
```

### auto-index-watch-all
여러 폴더와 glob 패턴을 처리합니다.

```bash
auto-index-watch-all <path1> [path2] [path3] ...
```

**예시:**
```bash
# 기본 사용
auto-index-watch-all src/components

# glob 패턴
auto-index-watch-all "src/**/components"

# 여러 패턴
auto-index-watch-all src/components "src/app/**/components" "packages/**/utils"
```

## 고급 설정 예시

### 경로별 네이밍 규칙 설정

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

### React 컴포넌트용 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["src/**/components"],
        "fileExtensions": [".tsx", ".ts"],
        "namingConvention": "pascalCase",
        "exportStyle": "named"
      }
    ]
  }
}
```

### 유틸리티 함수용 설정
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

### 훅용 설정
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

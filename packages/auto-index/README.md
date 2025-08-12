# @repo/auto-index

폴더를 자동으로 스캔하여 `index.ts` 파일을 생성하는 범용 도구입니다.

## 🚀 빠른 시작

```bash
# 패키지 설치
pnpm add @repo/auto-index

# CLI 사용 (단일 폴더)
npx auto-index src/components

# CLI 사용 (감시 모드)
npx auto-index src/components --watch

# CLI 사용 (watchTargets 설정)
npx auto-index --watch

# 도움말 보기
npx auto-index --help
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

# 감시 모드 (파일 변경 시 자동 업데이트)
auto-index src/components --watch
```

### 2. watchTargets 설정 사용

```bash
# package.json의 autoIndex 설정으로 감시 모드
auto-index --watch

# 특정 설정 오버라이드
auto-index --watch --exportStyle=named --namingConvention=PascalCase
```

### 3. 프로그래밍 방식 사용

```typescript
import { generateIndex } from '@repo/auto-index';

// 컴포넌트 폴더의 index.ts 파일 생성
generateIndex('./src/components');
```

### 4. CLI 옵션

```bash
# 도움말
auto-index --help

# 감시 모드
auto-index --watch

# 출력 파일명 지정
auto-index src/components --outputFile=index.ts

# 파일 확장자 지정
auto-index src/components --fileExtensions=.tsx,.ts

# export 스타일 지정
auto-index src/components --exportStyle=named

# 네이밍 규칙 지정
auto-index src/components --namingConvention=PascalCase

# 확장자 포함 여부
auto-index src/components --fromWithExtension=false
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
# package.json의 watchTargets 설정 사용
auto-index --watch

# 단일 폴더 감시
auto-index src/components --watch
```

## 설정 옵션

### package.json 설정

`package.json`에 `autoIndex` 필드를 추가하여 설정을 관리할 수 있습니다:

```json
{
  "autoIndex": {
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
        "namingConvention": "PascalCase"
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
      },
      {
        "watchPaths": [
          "public/assets/icons"
        ],
        "fileExtensions": [
          ".svg"
        ],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "PascalCase",
        "fromWithExtension": true
      }
    ]
  }
}
```

### 설정 옵션 설명

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `watchTargets` | `WatchTarget[]` | - | 감시할 타겟들 |

### WatchTarget 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `watchPaths` | `string[]` | - | 감시할 경로들 (glob 패턴 지원) |
| `fileExtensions` | `string[]` | `[".tsx", ".ts", ".jsx", ".js"]` | 처리할 파일 확장자 |
| `outputFile` | `string` | `"index.ts"` | 생성할 파일명 |
| `exportStyle` | `"default" \| "named" \| "star" \| "star-as" \| "mixed" \| "auto"` | `"auto"` | export 처리 방식 |
| `namingConvention` | `"camelCase" \| "PascalCase" \| "original"` | `"original"` | 네이밍 변환 규칙 |
| `fromWithExtension` | `boolean` | `true` | from 경로에 파일 확장자 포함 여부 |

### Export 스타일 옵션

| 스타일 | 설명 | 예시 |
|--------|------|------|
| `default` | default export만 | `export { default } from './Component';` |
| `named` | default를 named로 변환 | `export { default as Component } from './Component';` |
| `star` | export * 사용 | `export * from './Component';` |
| `star-as` | export * as 사용 | `export * as Component from './Component';` |
| `mixed` | default와 named 모두 | `export { default } from './Component';` + `export { default as Component } from './Component';` |
| `auto` | 파일 내용에 따라 자동 결정 | 파일 내용 분석 후 적절한 스타일 선택 |

### 네이밍 규칙 예시

**파일명**: `user-profile.tsx`

| namingConvention | 결과 | 설명 |
|------------------|------|------|
| `original` | `user_profile` | 기본값, 원본 파일명 유지 |
| `PascalCase` | `UserProfile` | React 컴포넌트용 |
| `camelCase` | `userProfile` | 유틸리티 함수용 |

### fromWithExtension 옵션 예시

**파일명**: `icon-logo.svg`

| fromWithExtension | 결과 |
|-------------------|------|
| `false` | `export { default as IconLogo } from './icon-logo';` |
| `true` | `export { default as IconLogo } from './icon-logo.svg';` |

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

### SVG 파일 폴더 구조
```
public/assets/icons/
├── icon-logo.svg
├── icon-menu.svg
└── index.ts (자동 생성됨)
```

### 생성되는 index.ts (fromWithExtension: true)
```typescript
export { default as IconLogo } from './icon-logo.svg';
export { default as IconMenu } from './icon-menu.svg';
```

## 설정

### package.json에 스크립트 추가

```json
{
  "scripts": {
    "generate:index": "auto-index src/components",
    "dev": "auto-index --watch"
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
    "dev:watch": "auto-index --watch"
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
단일 폴더를 처리하거나 watchTargets 설정을 사용합니다.

```bash
# 단일 폴더 처리
auto-index <folder-path> [output-file-path]

# 감시 모드 (단일 폴더)
auto-index <folder-path> --watch

# 감시 모드 (watchTargets 설정)
auto-index --watch

# 도움말
auto-index --help
```

**예시:**
```bash
# 기본 사용
auto-index src/components

# 감시 모드
auto-index src/components --watch

# 출력 파일 경로 지정
auto-index src/components output/components.ts

# watchTargets 설정 사용
auto-index --watch

# 옵션과 함께 사용
auto-index src/components --watch --exportStyle=named --namingConvention=PascalCase
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
        "namingConvention": "PascalCase",
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
        "namingConvention": "PascalCase",
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

### SVG/이미지 파일용 설정
```json
{
  "autoIndex": {
    "watchTargets": [
      {
        "watchPaths": ["public/assets/icons"],
        "fileExtensions": [".svg"],
        "namingConvention": "PascalCase",
        "exportStyle": "named",
        "fromWithExtension": true
      }
    ]
  }
}
``` 

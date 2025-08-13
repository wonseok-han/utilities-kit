# @repo/auto-index

폴더를 자동으로 스캔하여 `index.ts` 파일을 생성하는 범용 도구입니다.

## 🚀 빠른 시작

```bash
# 패키지 설치
pnpm add @repo/auto-index

# CLI 사용
npx auto-index --paths=src/components

# CLI 사용 (감시 모드)
npx auto-index --paths=src/components --watch

# CLI 사용 (package.json 설정 기반)
npx auto-index --watch

# 도움말 보기
npx auto-index --help
```

## 설치

```bash
pnpm add @repo/auto-index
```

## 사용법

### 1. CLI 기반 사용 (권장)

```bash
# 기본 사용법 (--paths는 필수)
auto-index --paths=src/components

# 여러 경로 지정
auto-index --paths=src/components,src/hooks

# 감시 모드 (파일 변경 시 자동 업데이트)
auto-index --paths=src/components --watch

# 출력 파일명 지정
auto-index --paths=src/components --outputFile=exports.ts

# 파일 확장자 지정
auto-index --paths=src/components --fileExtensions=.tsx,.ts

# 제외할 파일 패턴 지정
auto-index --paths=src/components --excludes=*.d.ts,*.test.ts

# export 스타일 지정
auto-index --paths=src/components --exportStyle=named

# 네이밍 규칙 지정
auto-index --paths=src/components --namingConvention=PascalCase

# 확장자 포함 여부
auto-index --paths=src/components --fromWithExtension=false
```

### 2. package.json 설정 기반 사용

```bash
# package.json의 autoIndex 설정으로 감시 모드
auto-index --watch

# 특정 설정 오버라이드
auto-index --paths=src/components --watch --exportStyle=named --namingConvention=PascalCase
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

# 필수 옵션
--paths=<경로1,경로2>    처리할 폴더 경로 (쉼표로 구분하여 여러 경로 지정 가능)

# 일반 옵션
--outputFile=<파일명>     생성할 index.ts 파일의 이름 (기본값: index.ts)
--fileExtensions=<확장자> 감시할 파일 확장자 (예: .tsx,.ts)
--excludes=<패턴1,패턴2>  제외할 파일 패턴 (예: *.d.ts,*.png)
--exportStyle=<스타일>    생성할 export 스타일 (default, named, star, star-as, mixed, auto)
--namingConvention=<규칙> 파일명 변환 규칙 (camelCase, original, PascalCase)
--fromWithExtension=<true|false> 파일 경로에 확장자 포함 여부 (기본값: false)

# 모드 옵션
--watch                  감시 모드 활성화
-h, --help              도움말 출력
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
# package.json의 targets 설정 사용
auto-index --watch

# 단일 폴더 감시
auto-index --paths=src/components --watch
```

## 설정 옵션

### package.json 설정

`package.json`에 `autoIndex` 필드를 추가하여 설정을 관리할 수 있습니다:

```json
{
  "autoIndex": {
    "targets": [
      {
        "paths": ["src/components", "src/app/**/components"],
        "fileExtensions": [".tsx", ".ts", ".jsx", ".js"],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "PascalCase",
        "excludes": ["*.d.ts", "*.test.ts"]
      },
      {
        "paths": ["src/hooks"],
        "fileExtensions": [".tsx", ".ts", ".jsx", ".js"],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "camelCase",
        "excludes": ["*.d.ts"]
      },
      {
        "paths": ["public/assets/icons"],
        "fileExtensions": [".svg"],
        "outputFile": "index.ts",
        "exportStyle": "named",
        "namingConvention": "PascalCase",
        "fromWithExtension": true,
        "excludes": ["*.png", "*.jpg"]
      }
    ]
  }
}
```

### 설정 옵션 설명

| 옵션      | 타입       | 기본값 | 설명          |
| --------- | ---------- | ------ | ------------- |
| `targets` | `Target[]` | -      | 처리할 타겟들 |

### Target 옵션

| 옵션                | 타입                                                               | 기본값                           | 설명                              |
| ------------------- | ------------------------------------------------------------------ | -------------------------------- | --------------------------------- |
| `paths`             | `string[]`                                                         | -                                | 처리할 경로들 (glob 패턴 지원)    |
| `fileExtensions`    | `string[]`                                                         | `[".tsx", ".ts", ".jsx", ".js"]` | 처리할 파일 확장자                |
| `outputFile`        | `string`                                                           | `"index.ts"`                     | 생성할 파일명                     |
| `exportStyle`       | `"default" \| "named" \| "star" \| "star-as" \| "mixed" \| "auto"` | `"auto"`                         | export 처리 방식                  |
| `namingConvention`  | `"camelCase" \| "PascalCase" \| "original"`                        | `"original"`                     | 네이밍 변환 규칙                  |
| `fromWithExtension` | `boolean`                                                          | `false`                          | from 경로에 파일 확장자 포함 여부 |
| `excludes`          | `string[]`                                                         | `[]`                             | 제외할 파일 패턴들                |

### Export 스타일 옵션

| 스타일    | 설명                       | 예시                                                                                             |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `default` | default export만           | `export { default } from './Component';`                                                         |
| `named`   | default를 named로 변환     | `export { default as Component } from './Component';`                                            |
| `star`    | export \* 사용             | `export * from './Component';`                                                                   |
| `star-as` | export \* as 사용          | `export * as Component from './Component';`                                                      |
| `mixed`   | default와 named 모두       | `export { default } from './Component';` + `export { default as Component } from './Component';` |
| `auto`    | 파일 내용에 따라 자동 결정 | 파일 내용 분석 후 적절한 스타일 선택                                                             |

### 네이밍 규칙 예시

**파일명**: `user-profile.tsx`

| namingConvention | 결과           | 설명                     |
| ---------------- | -------------- | ------------------------ |
| `original`       | `user_profile` | 기본값, 원본 파일명 유지 |
| `PascalCase`     | `UserProfile`  | React 컴포넌트용         |
| `camelCase`      | `userProfile`  | 유틸리티 함수용          |

### fromWithExtension 옵션 예시

**파일명**: `icon-logo.svg`

| fromWithExtension | 결과                                                     |
| ----------------- | -------------------------------------------------------- |
| `false`           | `export { default as IconLogo } from './icon-logo';`     |
| `true`            | `export { default as IconLogo } from './icon-logo.svg';` |

### excludes 옵션 예시

**패턴**: `*.d.ts, *.test.ts, *.png`

| 패턴        | 설명                      |
| ----------- | ------------------------- |
| `*.d.ts`    | TypeScript 선언 파일 제외 |
| `*.test.ts` | 테스트 파일 제외          |
| `*.png`     | PNG 이미지 파일 제외      |

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
    "generate:index": "auto-index --paths=src/components",
    "dev": "auto-index --paths=src/components --watch"
  },
  "autoIndex": {
    "targets": [
      {
        "paths": ["src/components", "src/app/**/components"]
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
    "targets": [
      {
        "paths": ["src/**/components", "src/**/hooks"]
      }
    ]
  }
}
```

## CLI 명령어

### auto-index

폴더를 처리하거나 package.json 설정을 사용합니다.

```bash
# CLI 기반 사용 (--paths는 필수)
auto-index --paths=<폴더경로>

# 감시 모드 (CLI 기반)
auto-index --paths=<폴더경로> --watch

# 감시 모드 (package.json 설정 기반)
auto-index --watch

# 도움말
auto-index --help
```

**예시:**

```bash
# 기본 사용
auto-index --paths=src/components

# 감시 모드
auto-index --paths=src/components --watch

# 여러 경로 지정
auto-index --paths=src/components,src/hooks

# 제외 패턴과 함께
auto-index --paths=src/components --excludes=*.d.ts,*.test.ts

# package.json 설정 사용
auto-index --watch

# 옵션과 함께 사용
auto-index --paths=src/components --watch --exportStyle=named --namingConvention=PascalCase
```

## 고급 설정 예시

### 경로별 네이밍 규칙 설정

```json
{
  "autoIndex": {
    "targets": [
      {
        "paths": ["src/**/components", "src/app/**/components"],
        "namingConvention": "PascalCase",
        "exportStyle": "named"
      },
      {
        "paths": ["src/**/hooks"],
        "namingConvention": "camelCase",
        "exportStyle": "named"
      },
      {
        "paths": ["src/**/utils"],
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
    "targets": [
      {
        "paths": ["src/**/components"],
        "fileExtensions": [".tsx", ".ts"],
        "namingConvention": "PascalCase",
        "exportStyle": "named",
        "excludes": ["*.d.ts", "*.test.ts"]
      }
    ]
  }
}
```

### 유틸리티 함수용 설정

```json
{
  "autoIndex": {
    "targets": [
      {
        "paths": ["src/**/utils", "packages/**/utils"],
        "fileExtensions": [".ts", ".js"],
        "namingConvention": "camelCase",
        "exportStyle": "named",
        "excludes": ["*.d.ts"]
      }
    ]
  }
}
```

### SVG/이미지 파일용 설정

```json
{
  "autoIndex": {
    "targets": [
      {
        "paths": ["public/assets/icons"],
        "fileExtensions": [".svg"],
        "namingConvention": "PascalCase",
        "exportStyle": "named",
        "fromWithExtension": true,
        "excludes": ["*.png", "*.jpg", "*.gif"]
      }
    ]
  }
}
```

## 동작 모드

### 1. CLI 전용 모드 (`cli-only`)

- `--paths` 옵션이 제공되고 package.json에 `autoIndex` 설정이 없는 경우
- CLI 옵션만으로 동작

### 2. 설정 기반 모드 (`config-based`)

- `--paths` 옵션이 없고 package.json에 `autoIndex` 설정이 있는 경우
- package.json 설정만으로 동작

### 3. 하이브리드 모드 (`hybrid`)

- `--paths` 옵션이 제공되고 package.json에 `autoIndex` 설정도 있는 경우
- CLI 옵션이 package.json 설정을 오버라이드

## 주의사항

- `--paths` 옵션은 CLI 사용 시 필수입니다
- `outputFile`로 지정된 파일은 자동으로 제외되어 무한 루프를 방지합니다
- `excludes` 패턴은 glob 패턴을 지원합니다 (`*.d.ts`, `*test*` 등)
- package.json 설정을 사용할 때는 `paths` 필드가 필요합니다

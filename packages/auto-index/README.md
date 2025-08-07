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
    "dev": "concurrently \"next dev\" \"auto-index-watch-all src/components \"src/app/**/components\"\""
  }
}
```

### 개발 중 자동 감지

```json
{
  "scripts": {
    "dev:watch": "auto-index-watch-all \"src/**/components\" \"src/**/hooks\""
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

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
    "dev:watch": "auto-index-watch-all \"src/**/components\" \"src/**/hooks\"",
    "dev": "concurrently \"next dev\" \"auto-index-watch-all src/components \"src/app/**/components\"\""
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

## 7. 지원하는 Export 패턴

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

## 8. 개발 환경 설정

### Next.js 프로젝트

```json
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"auto-index-watch-all src/components \"src/app/**/components\"\"",
    "build": "auto-index src/components && next build"
  }
}
```

### React 프로젝트

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"auto-index-watch-all \"src/**/components\"\"",
    "build": "auto-index src/components && vite build"
  }
}
```

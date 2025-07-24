import { useEffect, useRef } from 'react';

// 이전 값을 추적하는 커스텀 훅
export function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

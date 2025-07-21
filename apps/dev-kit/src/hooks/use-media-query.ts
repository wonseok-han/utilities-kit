import { useEffect, useState } from 'react';

/**
 * 미디어 쿼리 상태를 관리하는 커스텀 훅
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매치 여부 (hydration 전에는 undefined)
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [isMatched, setIsMatched] = useState<boolean | undefined>(undefined);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setIsMatched(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setIsMatched(event.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  // 하이드레이션 전까지는 undefined 반환
  if (!hasMounted) {
    return undefined;
  }

  return isMatched;
}

/**
 * 모바일 환경 감지를 위한 편의 훅
 * @returns 모바일 환경 여부 (hydration 전에는 undefined)
 */
export function useIsMobile(): boolean | undefined {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * 데스크톱 환경 감지를 위한 편의 훅
 * @returns 데스크톱 환경 여부 (hydration 전에는 undefined)
 */
export function useIsDesktop(): boolean | undefined {
  return useMediaQuery('(min-width: 768px)');
}

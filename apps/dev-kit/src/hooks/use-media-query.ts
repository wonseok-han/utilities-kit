import { useEffect, useState } from 'react';

/**
 * 미디어 쿼리 상태를 관리하는 커스텀 훅
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매치 여부
 */
export function useMediaQuery(query: string): boolean {
  const [isMatched, setIsMatched] = useState(false);
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

  // 하이드레이션 전까지는 기본값 반환
  if (!hasMounted) {
    return false;
  }

  return isMatched;
}

/**
 * 모바일 환경 감지를 위한 편의 훅
 * @returns 모바일 환경 여부
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * 데스크톱 환경 감지를 위한 편의 훅
 * @returns 데스크톱 환경 여부
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

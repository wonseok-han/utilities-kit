import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  root?: Element | null;
}

/**
 * 무한스크롤을 위한 커스텀 훅
 *
 * 스크롤이 하단에 도달하면 자동으로 더 많은 데이터를 로드합니다.
 *
 * @param props
 * @param props.onLoadMore - 더 많은 데이터를 로드하는 함수
 * @param props.hasMore - 더 로드할 데이터가 있는지 여부
 * @param props.isLoading - 현재 로딩 중인지 여부
 * @param props.threshold - 스크롤 감지 임계값 (기본값: 100px)
 * @param props.root - 스크롤 컨테이너 요소 (기본값: viewport)
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  root = null,
  threshold = 100,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target?.isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  useEffect(() => {
    if (!loadingRef?.current) {
      return;
    }

    const element = loadingRef.current;

    // root가 null이면 viewport를 사용
    const observerRoot = root || null;

    // 기존 observer가 있으면 먼저 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: observerRoot,
      rootMargin: `${threshold}px`,
      threshold: [0, 0.25, 0.5, 0.75, 1], // 여러 임계값으로 테스트
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingRef?.current, threshold, hasMore, isLoading, root, onLoadMore]); // loadingRef는 ref이므로 의존성에서 제외

  return loadingRef;
}

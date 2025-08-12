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
  const isSetupRef = useRef(false);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target?.isIntersecting && hasMore && !isLoading) {
      console.log(
        '🔄 Triggering loadMore - isIntersecting:',
        target.isIntersecting
      );
      onLoadMore();
    }
  };

  const setupObserver = () => {
    if (!loadingRef?.current) {
      console.log('❌ loadingRef.current is null');
      return false;
    }

    const element = loadingRef.current;

    // 기존 observer가 있으면 먼저 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: root,
      rootMargin: `${threshold}px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    observerRef.current.observe(element);
    console.log('👁️ IntersectionObserver set up for element:', element);
    isSetupRef.current = true;
    return true;
  };

  useEffect(() => {
    // 즉시 시도
    if (setupObserver()) {
      return;
    }

    // DOM이 준비되지 않았으면 약간의 지연 후 다시 시도
    const timer = setTimeout(() => {
      if (!isSetupRef.current) {
        console.log('🔄 Retrying observer setup...');
        setupObserver();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
        console.log('🧹 IntersectionObserver disconnected');
        isSetupRef.current = false;
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold, root]);

  // DOM이 변경될 때마다 다시 설정
  useEffect(() => {
    if (loadingRef.current && !isSetupRef.current) {
      console.log('🔄 Re-setting up observer due to DOM change');
      setupObserver();
    }
  });

  return loadingRef;
}

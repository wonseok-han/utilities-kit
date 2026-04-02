'use client';

import { useSettingStore } from '@store/setting-store';
import { useEffect } from 'react';

/**
 * 설정 스토어의 값을 DOM에 실제 적용하는 프로바이더 컴포넌트.
 * - theme → <html data-theme="light|dark">
 * - fontSize → CSS 변수 --app-font-size
 * - compactMode → <html data-compact="true|false">
 */
export function SettingsProvider() {
  const {
    compactMode: isCompactMode,
    fontSize,
    hasHydrated,
    theme,
  } = useSettingStore();

  // 테마 적용
  useEffect(() => {
    if (!hasHydrated) return;

    const root = document.documentElement;

    const applyTheme = (resolvedTheme: 'light' | 'dark') => {
      root.setAttribute('data-theme', resolvedTheme);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }

    applyTheme(theme);
    return undefined;
  }, [theme, hasHydrated]);

  // 폰트 사이즈 적용
  useEffect(() => {
    if (!hasHydrated) return;
    document.documentElement.style.setProperty(
      '--app-font-size',
      `${fontSize}px`
    );
  }, [fontSize, hasHydrated]);

  // 컴팩트 모드 적용
  useEffect(() => {
    if (!hasHydrated) return;
    document.documentElement.setAttribute(
      'data-compact',
      String(isCompactMode)
    );
  }, [isCompactMode, hasHydrated]);

  return null;
}

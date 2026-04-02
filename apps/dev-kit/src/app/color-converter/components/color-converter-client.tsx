'use client';

import { ActionButton, useSnackbar } from '@repo/ui';
import { useCallback, useState } from 'react';

// ===== 색상 변환 유틸리티 =====

interface RGB {
  b: number;
  g: number;
  r: number;
}
interface HSL {
  h: number;
  l: number;
  s: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  let full = clean;
  if (full.length === 3) {
    full =
      (full[0] ?? '') +
      (full[0] ?? '') +
      (full[1] ?? '') +
      (full[1] ?? '') +
      (full[2] ?? '') +
      (full[2] ?? '');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    b: parseInt(full.slice(4, 6), 16),
    g: parseInt(full.slice(2, 4), 16),
    r: parseInt(full.slice(0, 2), 16),
  };
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    l: Math.round(l * 100),
    s: Math.round(s * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { b: v, g: v, r: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
  };
}

// 입력 문자열에서 색상 파싱 시도
function parseColor(
  input: string
): { hsl: HSL; rgb: RGB; source: 'hex' | 'hsl' | 'rgb' } | null {
  const trimmed = input.trim();

  // HEX
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const rgb = hexToRgb(hexMatch[1] ?? '');
    if (rgb) return { hsl: rgbToHsl(rgb), rgb, source: 'hex' };
  }

  // RGB
  const rgbMatch = trimmed.match(
    /^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i
  );
  if (rgbMatch) {
    const rgb = {
      b: clamp(Number(rgbMatch[3]), 0, 255),
      g: clamp(Number(rgbMatch[2]), 0, 255),
      r: clamp(Number(rgbMatch[1]), 0, 255),
    };
    return { hsl: rgbToHsl(rgb), rgb, source: 'rgb' };
  }

  // HSL
  const hslMatch = trimmed.match(
    /^hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*[\d.]+\s*)?\)$/i
  );
  if (hslMatch) {
    const hsl = {
      h: clamp(Number(hslMatch[1]), 0, 360),
      l: clamp(Number(hslMatch[3]), 0, 100),
      s: clamp(Number(hslMatch[2]), 0, 100),
    };
    return { hsl, rgb: hslToRgb(hsl), source: 'hsl' };
  }

  return null;
}

// 프리셋 팔레트
const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#14b8a6',
  '#6366f1',
  '#a855f7',
  '#000000',
  '#374151',
  '#6b7280',
  '#9ca3af',
  '#d1d5db',
  '#ffffff',
];

export function ColorConverterClient() {
  const [input, setInput] = useState('#3b82f6');
  const { showSnackbar } = useSnackbar();

  const parsed = parseColor(input);
  const hex = parsed ? rgbToHex(parsed.rgb) : null;
  const rgbStr = parsed
    ? `rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`
    : null;
  const hslStr = parsed
    ? `hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)`
    : null;

  const handleCopy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSnackbar({
          message: `${text} 복사 완료`,
          type: 'success',
          position: 'bottom-right',
          autoHideDuration: 2000,
        });
      } catch {
        showSnackbar({
          message: '복사에 실패했습니다.',
          type: 'error',
          position: 'bottom-right',
          autoHideDuration: 4000,
        });
      }
    },
    [showSnackbar]
  );

  // 밝기 계산 (텍스트 색상 결정용)
  const isLight = parsed
    ? parsed.rgb.r * 0.299 + parsed.rgb.g * 0.587 + parsed.rgb.b * 0.114 > 150
    : false;

  return (
    <div className="flex flex-col gap-6">
      {/* 입력 + 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-secondary mb-2">
              색상 입력 (HEX, RGB, HSL)
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-input-bg border border-input-border rounded-lg px-4 py-2.5 text-on-surface font-mono focus:ring-2 focus:ring-accent focus:border-transparent"
                onChange={(e) => setInput(e.target.value)}
                placeholder="#3b82f6 또는 rgb(59,130,246) 또는 hsl(217,91%,60%)"
                value={input}
              />
              <input
                className="w-12 h-11 rounded-lg border border-input-border cursor-pointer"
                onChange={(e) => setInput(e.target.value)}
                type="color"
                value={hex || '#000000'}
              />
            </div>
            {!parsed && input.trim() && (
              <p className="text-danger text-xs mt-1.5">
                유효한 색상 값을 입력하세요 (예: #ff0000, rgb(255,0,0),
                hsl(0,100%,50%))
              </p>
            )}
          </div>

          {/* 변환 결과 */}
          {parsed && (
            <div className="space-y-2">
              {[
                { label: 'HEX', value: hex ?? '' },
                { label: 'RGB', value: rgbStr ?? '' },
                { label: 'HSL', value: hslStr ?? '' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-deep"
                >
                  <span className="text-xs font-semibold text-on-surface-muted w-8">
                    {item.label}
                  </span>
                  <code className="flex-1 text-sm font-mono text-on-surface">
                    {item.value}
                  </code>
                  <button
                    className="text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                    onClick={() => handleCopy(item.value)}
                    title="복사"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 미리보기 */}
        <div className="flex flex-col gap-4">
          {/* 큰 미리보기 */}
          <div
            className="rounded-2xl border border-border flex items-center justify-center min-h-[180px] transition-colors"
            style={{ backgroundColor: hex || '#000000' }}
          >
            {parsed && (
              <span
                className="text-lg font-mono font-bold"
                style={{ color: isLight ? '#000000' : '#ffffff' }}
              >
                {hex}
              </span>
            )}
          </div>

          {/* 텍스트 미리보기 */}
          {parsed && (
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-4 border border-border"
                style={{ backgroundColor: hex || undefined }}
              >
                <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                  흰 텍스트
                </p>
                <p className="text-xs mt-1" style={{ color: '#ffffffcc' }}>
                  White on color
                </p>
              </div>
              <div
                className="rounded-xl p-4 border border-border"
                style={{ backgroundColor: hex || undefined }}
              >
                <p className="text-sm font-medium" style={{ color: '#000000' }}>
                  검정 텍스트
                </p>
                <p className="text-xs mt-1" style={{ color: '#000000cc' }}>
                  Black on color
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HSL 슬라이더 */}
      {parsed && (
        <div className="p-4 rounded-xl border border-border bg-surface-deep">
          <h3 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-4">
            HSL 조절
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'H',
                max: 360,
                name: 'Hue',
                value: parsed.hsl.h,
                bg: `linear-gradient(to right, hsl(0,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(60,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(120,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(180,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(240,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(300,${parsed.hsl.s}%,${parsed.hsl.l}%), hsl(360,${parsed.hsl.s}%,${parsed.hsl.l}%))`,
              },
              {
                label: 'S',
                max: 100,
                name: 'Saturation',
                value: parsed.hsl.s,
                bg: `linear-gradient(to right, hsl(${parsed.hsl.h},0%,${parsed.hsl.l}%), hsl(${parsed.hsl.h},100%,${parsed.hsl.l}%))`,
              },
              {
                label: 'L',
                max: 100,
                name: 'Lightness',
                value: parsed.hsl.l,
                bg: `linear-gradient(to right, hsl(${parsed.hsl.h},${parsed.hsl.s}%,0%), hsl(${parsed.hsl.h},${parsed.hsl.s}%,50%), hsl(${parsed.hsl.h},${parsed.hsl.s}%,100%))`,
              },
            ].map((slider) => (
              <div key={slider.label} className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold text-on-surface-muted w-4">
                  {slider.label}
                </span>
                <div className="flex-1 relative h-6 flex items-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: slider.bg }}
                  />
                  <input
                    className="relative w-full h-6 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:shadow-md"
                    max={slider.max}
                    min="0"
                    onChange={(e) => {
                      const newHsl = { ...parsed.hsl };
                      if (slider.label === 'H')
                        newHsl.h = Number(e.target.value);
                      else if (slider.label === 'S')
                        newHsl.s = Number(e.target.value);
                      else newHsl.l = Number(e.target.value);
                      const newRgb = hslToRgb(newHsl);
                      setInput(rgbToHex(newRgb));
                    }}
                    type="range"
                    value={slider.value}
                  />
                </div>
                <span className="text-xs font-mono text-on-surface-muted w-10 text-right">
                  {slider.value}
                  {slider.label !== 'H' ? '%' : '°'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프리셋 팔레트 */}
      <div className="p-4 rounded-xl border border-border bg-surface-deep">
        <h3 className="text-xs font-semibold text-on-surface-muted uppercase tracking-wider mb-3">
          프리셋
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className={`w-9 h-9 rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${
                hex === color
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-border'
              }`}
              onClick={() => setInput(color)}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 샘플 데이터 */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h3 className="text-sm font-medium text-on-surface-secondary mb-2">
          샘플 입력{' '}
          <span className="text-xs text-accent">(버튼을 누르면 자동 입력)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { data: '#e74c3c', label: 'HEX' },
            { data: 'rgb(46, 204, 113)', label: 'RGB' },
            { data: 'hsl(217, 91%, 60%)', label: 'HSL' },
            { data: '#1a1a2e', label: 'Dark' },
            { data: 'rgb(255, 195, 0)', label: 'Gold' },
          ].map((sample) => (
            <ActionButton
              key={sample.label}
              feedbackText="로드 완료"
              onClick={() => setInput(sample.data)}
              variant="secondary"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm border border-border"
                  style={{
                    backgroundColor: parseColor(sample.data)
                      ? rgbToHex(parseColor(sample.data)!.rgb)
                      : '#000',
                  }}
                />
                {sample.label}
              </span>
            </ActionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

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

// CSS Named Colors (148개)
// prettier-ignore
const CSS_NAMED_COLORS: [string, number, number, number][] = [
  ['aliceblue',240,248,255],['antiquewhite',250,235,215],['aqua',0,255,255],['aquamarine',127,255,212],['azure',240,255,255],
  ['beige',245,245,220],['bisque',255,228,196],['black',0,0,0],['blanchedalmond',255,235,205],['blue',0,0,255],
  ['blueviolet',138,43,226],['brown',165,42,42],['burlywood',222,184,135],['cadetblue',95,158,160],['chartreuse',127,255,0],
  ['chocolate',210,105,30],['coral',255,127,80],['cornflowerblue',100,149,237],['cornsilk',255,248,220],['crimson',220,20,60],
  ['cyan',0,255,255],['darkblue',0,0,139],['darkcyan',0,139,139],['darkgoldenrod',184,134,11],['darkgray',169,169,169],
  ['darkgreen',0,100,0],['darkkhaki',189,183,107],['darkmagenta',139,0,139],['darkolivegreen',85,107,47],['darkorange',255,140,0],
  ['darkorchid',153,50,204],['darkred',139,0,0],['darksalmon',233,150,122],['darkseagreen',143,188,143],['darkslateblue',72,61,139],
  ['darkslategray',47,79,79],['darkturquoise',0,206,209],['darkviolet',148,0,211],['deeppink',255,20,147],['deepskyblue',0,191,255],
  ['dimgray',105,105,105],['dodgerblue',30,144,255],['firebrick',178,34,34],['floralwhite',255,250,240],['forestgreen',34,139,34],
  ['fuchsia',255,0,255],['gainsboro',220,220,220],['ghostwhite',248,248,255],['gold',255,215,0],['goldenrod',218,165,32],
  ['gray',128,128,128],['green',0,128,0],['greenyellow',173,255,47],['honeydew',240,255,240],['hotpink',255,105,180],
  ['indianred',205,92,92],['indigo',75,0,130],['ivory',255,255,240],['khaki',240,230,140],['lavender',230,230,250],
  ['lavenderblush',255,240,245],['lawngreen',124,252,0],['lemonchiffon',255,250,205],['lightblue',173,216,230],['lightcoral',240,128,128],
  ['lightcyan',224,255,255],['lightgoldenrodyellow',250,250,210],['lightgray',211,211,211],['lightgreen',144,238,144],['lightpink',255,182,193],
  ['lightsalmon',255,160,122],['lightseagreen',32,178,170],['lightskyblue',135,206,250],['lightslategray',119,136,153],['lightsteelblue',176,196,222],
  ['lightyellow',255,255,224],['lime',0,255,0],['limegreen',50,205,50],['linen',250,240,230],['magenta',255,0,255],
  ['maroon',128,0,0],['mediumaquamarine',102,205,170],['mediumblue',0,0,205],['mediumorchid',186,85,211],['mediumpurple',147,112,219],
  ['mediumseagreen',60,179,113],['mediumslateblue',123,104,238],['mediumspringgreen',0,250,154],['mediumturquoise',72,209,204],['mediumvioletred',199,21,133],
  ['midnightblue',25,25,112],['mintcream',245,255,250],['mistyrose',255,228,225],['moccasin',255,228,181],['navajowhite',255,222,173],
  ['navy',0,0,128],['oldlace',253,245,230],['olive',128,128,0],['olivedrab',107,142,35],['orange',255,165,0],
  ['orangered',255,69,0],['orchid',218,112,214],['palegoldenrod',238,232,170],['palegreen',152,251,152],['paleturquoise',175,238,238],
  ['palevioletred',219,112,147],['papayawhip',255,239,213],['peachpuff',255,218,185],['peru',205,133,63],['pink',255,192,203],
  ['plum',221,160,221],['powderblue',176,224,230],['purple',128,0,128],['rebeccapurple',102,51,153],['red',255,0,0],
  ['rosybrown',188,143,143],['royalblue',65,105,225],['saddlebrown',139,69,19],['salmon',250,128,114],['sandybrown',244,164,96],
  ['seagreen',46,139,87],['seashell',255,245,238],['sienna',160,82,45],['silver',192,192,192],['skyblue',135,206,235],
  ['slateblue',106,90,205],['slategray',112,128,144],['snow',255,250,250],['springgreen',0,255,127],['steelblue',70,130,180],
  ['tan',210,180,140],['teal',0,128,128],['thistle',216,191,216],['tomato',255,99,71],['turquoise',64,224,208],
  ['violet',238,130,238],['wheat',245,222,179],['white',255,255,255],['whitesmoke',245,245,245],['yellow',255,255,0],['yellowgreen',154,205,50],
];

function findClosestColorName(rgb: RGB): {
  distance: number;
  exact: boolean;
  name: string;
} {
  let bestName = '';
  let bestDist = Infinity;
  for (const [name, r, g, b] of CSS_NAMED_COLORS) {
    const dr = rgb.r - r;
    const dg = rgb.g - g;
    const db = rgb.b - b;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      bestName = name;
      if (dist === 0) break;
    }
  }
  return {
    distance: Math.sqrt(bestDist),
    exact: bestDist === 0,
    name: bestName,
  };
}

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
  const colorName = parsed ? findClosestColorName(parsed.rgb) : null;

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
              {/* 색상 이름 */}
              {colorName && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-deep">
                  <span className="text-xs font-semibold text-on-surface-muted w-8">
                    Name
                  </span>
                  <code className="flex-1 text-sm font-mono text-on-surface">
                    {colorName.name}
                    {!colorName.exact && (
                      <span className="text-on-surface-muted ml-1.5 text-xs font-sans">
                        (approximate)
                      </span>
                    )}
                  </code>
                  <button
                    className="text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                    onClick={() => handleCopy(colorName.name)}
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
              )}
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

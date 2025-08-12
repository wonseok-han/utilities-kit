import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from './constant';
import { AutoIndexConfig } from './types';

/**
 * package.json에서 설정을 읽어옵니다
 */
export function getConfigFromPackageJson(): AutoIndexConfig {
  try {
    // 1) 기본값
    let merged: AutoIndexConfig = { ...DEFAULT_CONFIG };

    // 2) package.json에서 autoIndex 읽기 (상위 디렉토리 탐색)
    let currentDir = process.cwd();
    let packageJsonPath: string | null = null;
    while (currentDir !== path.dirname(currentDir)) {
      const testPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(testPath)) {
        packageJsonPath = testPath;
        break;
      }
      currentDir = path.dirname(currentDir);
    }
    if (packageJsonPath) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.autoIndex && typeof packageJson.autoIndex === 'object') {
        const pkgConfig: AutoIndexConfig = {
          ...merged,
          ...packageJson.autoIndex,
        };
        merged = pkgConfig;
      }
    }

    // 3) 환경 변수로 전달된 설정 적용 (watch-all에서 전달)
    if (process.env.AUTO_INDEX_CONFIG) {
      try {
        const envConfig = JSON.parse(
          process.env.AUTO_INDEX_CONFIG
        ) as Partial<AutoIndexConfig>;
        merged = {
          ...merged,
          ...envConfig,
        } as AutoIndexConfig;
      } catch {
        // 환경변수 파싱 실패는 무시
      }
    }

    return merged;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('package.json 설정 읽기 오류:', errorMessage);
    return DEFAULT_CONFIG;
  }
}

/**
 * 문자열을 불린 값으로 파싱하는 유틸리티
 * @param value - 파싱할 값 (문자열, 불린, undefined)
 * @returns 파싱된 불린 값 또는 undefined
 */
export function parseBoolean(
  value: string | true | undefined
): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === true) return true;
  const lowered = String(value).toLowerCase();
  if (lowered === 'true') return true;
  if (lowered === 'false') return false;
  return undefined;
}

/**
 * 확장자 문자열을 배열로 파싱하는 유틸리티
 * @param value - 쉼표로 구분된 확장자 문자열
 * @returns 파싱된 확장자 배열 또는 undefined
 */
export function parseExtensions(
  value: string | undefined
): string[] | undefined {
  if (!value) return undefined;
  const raw = value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  if (raw.length === 0) return undefined;
  return raw.map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));
}

/**
 * 파일명을 유효한 JavaScript 변수명으로 변환
 * @param str - 변환할 파일명 문자열
 * @returns 유효한 JavaScript 변수명
 */
export function toValidJSVariableName(str: string): string {
  let validName = str.replace(/[^a-zA-Z0-9_]/g, '');
  if (/^[0-9]/.test(validName)) {
    validName = '_' + validName;
  }
  return validName;
}

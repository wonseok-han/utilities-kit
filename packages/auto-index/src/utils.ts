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
    let merged: AutoIndexConfig | undefined = { ...DEFAULT_CONFIG };

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
 * 쉼표로 구분된 문자열을 배열로 파싱하는 함수
 * @param value - 쉼표로 구분된 문자열
 * @returns 파싱된 배열 또는 undefined
 */
export function parseCommaSeparated(
  value: string | undefined
): string[] | undefined {
  if (!value) return undefined;

  const raw = value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  if (raw.length === 0) return undefined;

  return raw;
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

/**
 * 네이밍 규칙에 따라 파일명을 변환
 * @param name - 변환할 파일명
 * @param namingConvention - 적용할 네이밍 규칙 (camelCase, original, PascalCase)
 * @returns 변환된 파일명
 */
export function transformFileName(
  name: string,
  namingConvention: string
): string {
  // 먼저 하이픈과 언더스코어를 제거하고 camelCase로 변환
  const camelCaseName = name.replace(
    /[-_]([a-z])/g,
    (_match: string, letter: string) => letter.toUpperCase()
  );

  switch (namingConvention) {
    case 'camelCase':
      return camelCaseName.charAt(0).toLowerCase() + camelCaseName.slice(1);
    case 'original':
      return toValidJSVariableName(name);
    case 'PascalCase':
    default:
      return camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
  }
}

/**
 * 도움말 메시지를 출력합니다.
 */
export function printHelp(): void {
  console.log(`
사용법: auto-index [--watch] [--paths=<경로1,경로2>] [--outputFile=파일명] [--fileExtensions=.tsx,.ts] [--exportStyle=auto] [--namingConvention=original] [--fromWithExtension=true|false]

옵션:
  --paths=<경로1,경로2>     처리할 폴더 경로 (쉼표로 구분하여 여러 경로 지정 가능)
  --watch               감시 모드 활성화 (폴더 경로가 있으면 단일 폴더 감시, 없으면 targets 설정 사용)
  --outputFile=<파일명> 생성할 index.ts 파일의 이름 (기본값: index.ts)
  --fileExtensions=<확장자> 감시할 파일 확장자 (예: .tsx,.ts)
  --excludes=<패턴1,패턴2>  제외할 파일 패턴 (예: *.d.ts,*.png)
  --exportStyle=<스타일> 생성할 export 스타일 (default, named, star, star-as, mixed, auto)
  --namingConvention=<규칙> 파일명 변환 규칙 (camelCase, original, PascalCase)
  --fromWithExtension=<true|false> 파일 경로에 확장자 포함 여부 (기본값: true)
  -h, --help            도움말 출력

예시:
  auto-index --paths=src/components,src/hooks
  auto-index --paths=src/components --outputFile=index.ts
  auto-index --paths=src/components src/components/index.ts
  auto-index --paths=src/components --watch --exportStyle=named
  auto-index --paths=src/components --excludes=*.d.ts,*.test.ts
  auto-index --watch (targets 설정 사용)
`);
}

import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG, DEFAULT_WATCH_TARGETS_CONFIG } from './constant';
import { AutoIndexConfig, WatchTargetConfig } from './types';

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
 * CLI 인자 파싱 유틸리티
 */
function parseBoolean(value: string | true | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === true) return true;
  const lowered = String(value).toLowerCase();
  if (lowered === 'true') return true;
  if (lowered === 'false') return false;
  return undefined;
}

function parseExtensions(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const raw = value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  if (raw.length === 0) return undefined;
  return raw.map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));
}

interface ParsedCliArgs {
  folderPath?: string;
  outputPath?: string;
  isWatch: boolean;
  overrides: Partial<WatchTargetConfig>;
}

function parseCliArgs(args: string[]): ParsedCliArgs {
  const positionals: string[] = [];
  const overrides: Partial<WatchTargetConfig> = {};
  let isWatch = false;

  for (const arg of args) {
    if (arg === '--watch') {
      isWatch = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const [rawKey, rawVal] = arg.replace(/^--/, '').split('=');
      const key = rawKey?.trim();
      const val = rawVal === undefined ? true : rawVal.trim();

      switch (key) {
        case 'outputFile': {
          if (typeof val === 'string' && val) overrides.outputFile = val;
          break;
        }
        case 'fileExtensions': {
          const exts =
            typeof val === 'string' ? parseExtensions(val) : undefined;
          if (exts) overrides.fileExtensions = exts;
          break;
        }
        case 'exportStyle': {
          if (typeof val === 'string' && val)
            overrides.exportStyle = val as WatchTargetConfig['exportStyle'];
          break;
        }
        case 'namingConvention': {
          if (typeof val === 'string' && val)
            overrides.namingConvention =
              val as WatchTargetConfig['namingConvention'];
          break;
        }
        case 'fromWithExtension': {
          const boolVal = parseBoolean(val);
          if (typeof boolVal === 'boolean')
            overrides.fromWithExtension = boolVal;
          break;
        }
        default:
          // 알 수 없는 옵션은 무시
          break;
      }
    } else {
      positionals.push(arg);
    }
  }

  const folderPath = positionals[0];
  const outputPath = positionals[1];
  return { folderPath, outputPath, isWatch, overrides };
}

/**
 * 파일명을 유효한 JavaScript 변수명으로 변환
 */
function toValidJSVariableName(str: string): string {
  let validName = str.replace(/[^a-zA-Z0-9_]/g, '');
  if (/^[0-9]/.test(validName)) {
    validName = '_' + validName;
  }
  return validName;
}

/**
 * 네이밍 규칙에 따라 파일명을 변환
 */
function transformFileName(name: string, namingConvention: string): string {
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
 * 경로별 설정을 찾습니다
 */
function findTargetConfig(
  folderPath: string,
  config: AutoIndexConfig
): WatchTargetConfig {
  // watchTargets 설정이 있는지 확인
  if (config.watchTargets && Array.isArray(config.watchTargets)) {
    const relativePath = path.relative(process.cwd(), folderPath);

    for (const target of config.watchTargets) {
      if (target.watchPaths && Array.isArray(target.watchPaths)) {
        for (const watchPath of target.watchPaths) {
          // glob 패턴 매칭 (간단한 구현)
          if (watchPath.includes('**')) {
            const parts = watchPath.split('**/');
            if (parts.length === 2) {
              const basePath = parts[0];
              const targetFolder = parts[1];

              if (
                basePath !== undefined &&
                targetFolder !== undefined &&
                relativePath.startsWith(basePath) &&
                relativePath.includes(targetFolder)
              ) {
                // 해당 target에 기본값 병합
                return { ...DEFAULT_WATCH_TARGETS_CONFIG, ...target };
              }
            }
          } else {
            // 정확한 경로 매칭
            if (relativePath === watchPath) {
              // 해당 target에 기본값 병합
              return { ...DEFAULT_WATCH_TARGETS_CONFIG, ...target };
            }
          }
        }
      }
    }
  }

  return DEFAULT_WATCH_TARGETS_CONFIG;
}

/**
 * 컴포넌트 폴더를 스캔하여 index.ts 파일을 생성합니다
 */
export function generateIndex(
  folderPath: string,
  outputPath?: string,
  cliOverrides?: Partial<WatchTargetConfig>
): void {
  try {
    const config = getConfigFromPackageJson();
    const fullPath = path.resolve(folderPath);

    if (!fs.existsSync(fullPath)) {
      console.error(`폴더가 존재하지 않습니다: ${folderPath}`);
      return;
    }

    // 경로별 설정 적용
    const targetConfigBase = findTargetConfig(fullPath, config);
    const targetConfig: WatchTargetConfig = {
      ...targetConfigBase,
      ...(cliOverrides || {}),
    };

    console.log('🔍 설정 정보:', {
      folderPath,
      targetConfig,
      fileExtensions: targetConfig.fileExtensions,
      fromWithExtension: targetConfig.fromWithExtension,
    });

    const files = fs.readdirSync(fullPath);
    const componentFiles = files.filter((file: string) => {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);

      // 폴더는 제외하고 설정된 확장자 파일만 포함
      return (
        stat.isFile() &&
        targetConfig.fileExtensions.some((ext: string) => file.endsWith(ext)) &&
        file !== targetConfig.outputFile &&
        !file.endsWith('.d.ts') // 타입 정의 파일 제외
      );
    });

    const exports = new Set<string>(); // 중복 방지를 위해 Set 사용

    componentFiles.forEach((file: string) => {
      const name = path.parse(file).name;
      const extension = path.parse(file).ext;
      const exportName = transformFileName(name, targetConfig.namingConvention);

      // 파일 내용을 확인하여 default export가 있는지 체크
      const filePath = path.join(fullPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // includeExtension 옵션에 따라 from 경로 결정
      const fromPath = targetConfig.fromWithExtension
        ? `./${name}${extension}`
        : `./${name}`;

      // exportStyle에 따른 다양한 export 패턴 처리
      switch (targetConfig.exportStyle) {
        case 'default':
          // default export만
          exports.add(`export { default } from '${fromPath}';`);
          break;

        case 'named':
          // default export를 named export로 변환
          exports.add(
            `export { default as ${exportName} } from '${fromPath}';`
          );
          break;

        case 'star':
          // export * from 사용
          exports.add(`export * from '${fromPath}';`);
          break;

        case 'star-as':
          // export * as {이름} from 사용
          exports.add(`export * as ${exportName} from '${fromPath}';`);
          break;

        case 'mixed':
          // default와 named를 모두 export
          exports.add(`export { default } from '${fromPath}';`);
          exports.add(
            `export { default as ${exportName} } from '${fromPath}';`
          );
          break;

        case 'auto':
          // 파일 내용에 따라 자동 결정
          if (content.includes('export default')) {
            // default export가 있으면 named export로 변환
            exports.add(
              `export { default as ${exportName} } from '${fromPath}';`
            );
          } else {
            // default export가 없으면 star export 사용
            exports.add(`export * from '${fromPath}';`);
          }
          break;

        default:
          // 기본값: named export
          if (content.includes('export default')) {
            exports.add(
              `export { default as ${exportName} } from '${fromPath}';`
            );
          } else {
            exports.add(`export * from '${fromPath}';`);
          }
          break;
      }
    });

    // index.ts 파일 생성 (기존 내용 완전 삭제 후 새로 생성)
    const indexContent = Array.from(exports).join('\n') + '\n';
    const outputFilePath = outputPath
      ? path.resolve(outputPath)
      : path.join(folderPath, targetConfig.outputFile);

    // 기존 파일이 있으면 삭제하고 새로 생성
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }
    fs.writeFileSync(outputFilePath, indexContent, 'utf-8');
    console.log(
      `✅ ${targetConfig.outputFile} 파일이 생성되었습니다: ${outputFilePath}`
    );
    console.log(`📦 총 ${exports.size}개의 export가 추가되었습니다.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('index.ts 생성 중 오류:', errorMessage);
  }
}

// CLI 실행 함수
export function runCli(): void {
  const args = process.argv.slice(2);
  const { folderPath, outputPath, isWatch, overrides } = parseCliArgs(args);

  if (!folderPath) {
    console.log(
      '사용법: auto-index <폴더경로> [출력경로] [--watch] [--outputFile=파일명] [--fileExtensions=.tsx,.ts] [--exportStyle=auto] [--namingConvention=original] [--fromWithExtension=true|false]'
    );
    console.log('예시: auto-index src/components');
    console.log('예시: auto-index src/components --outputFile=index.ts');
    console.log('예시: auto-index src/components src/components/index.ts');
    console.log('예시: auto-index src/components --watch --exportStyle=named');
    return;
  }

  if (isWatch) {
    // 감시 모드
    const chokidar = require('chokidar');
    console.log(`🔍 파일 변경 감지 시작: ${folderPath}`);

    const config = getConfigFromPackageJson();
    const fullPath = path.resolve(folderPath);
    const targetConfigBase = findTargetConfig(fullPath, config);
    const targetConfig: WatchTargetConfig = {
      ...targetConfigBase,
      ...(overrides || {}),
    };
    const outputFileName = targetConfig.outputFile || 'index.ts';

    const watcher = chokidar.watch(folderPath, {
      ignored: [
        /(^|[\/\\])\../, // 숨김 파일 무시
        new RegExp(`${outputFileName.replace('.', '\\.')}$`), // outputFile 무시
        /\.d\.ts$/, // 타입 정의 파일 무시
      ],
      persistent: true,
    });

    watcher.on('add', (filePath: string) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`📝 파일 추가: ${fileName}`);
      generateIndex(folderPath, outputPath, overrides);
    });

    watcher.on('unlink', (filePath: string) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`🗑️  파일 삭제: ${fileName}`);
      generateIndex(folderPath, outputPath, overrides);
    });

    watcher.on('change', (filePath: string) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`📝 파일 변경: ${fileName}`);
      generateIndex(folderPath, outputPath, overrides);
    });

    // 프로세스 종료 시 감시 중지
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  } else {
    // 한 번만 실행
    generateIndex(folderPath, outputPath, overrides);
  }
}

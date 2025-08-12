import fs from 'fs';
import path from 'path';
import { DEFAULT_WATCH_TARGETS_CONFIG } from './constant';
import { AutoIndexConfig, ParsedCliArgs, WatchTargetConfig } from './types';
import {
  getConfigFromPackageJson,
  parseBoolean,
  parseExtensions,
  toValidJSVariableName,
} from './utils';

/**
 * CLI 인자 파싱 유틸리티
 * @param args - 명령행 인자 배열
 * @returns 파싱된 CLI 인자 객체
 */
function parseCliArgs(args: string[]): ParsedCliArgs {
  const positionals: string[] = [];
  const overrides: Partial<WatchTargetConfig> = {};
  let isWatch = false;
  let isHelp = false;

  for (const arg of args) {
    if (arg === '--watch') {
      isWatch = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      isHelp = true;
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
  return { folderPath, outputPath, isWatch, isHelp, overrides };
}

/**
 * 네이밍 규칙에 따라 파일명을 변환
 * @param name - 변환할 파일명
 * @param namingConvention - 적용할 네이밍 규칙 (camelCase, original, PascalCase)
 * @returns 변환된 파일명
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
 * @param folderPath - 설정을 찾을 폴더 경로
 * @param config - autoIndex 설정 객체
 * @returns 해당 경로에 적용할 WatchTargetConfig 설정
 *
 * 동작 방식:
 * 1. watchTargets 설정에서 해당 경로와 매칭되는 설정 찾기
 * 2. glob 패턴과 정확한 경로 모두 지원
 * 3. 매칭되는 설정이 없으면 기본 설정 반환
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
 * @param folderPath - 스캔할 폴더 경로
 * @param outputPath - 출력 파일 경로 (선택사항)
 * @param cliOverrides - CLI에서 전달된 설정 오버라이드 (선택사항)
 *
 * 동작 방식:
 * 1. 지정된 폴더의 파일들을 스캔
 * 2. 설정된 확장자와 네이밍 규칙에 따라 export 문 생성
 * 3. index.ts 파일에 export 문들을 작성
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

/**
 * 도움말 메시지를 출력합니다.
 */
function printHelp(): void {
  console.log(`
사용법: auto-index <폴더경로> [출력경로] [--watch] [--outputFile=파일명] [--fileExtensions=.tsx,.ts] [--exportStyle=auto] [--namingConvention=original] [--fromWithExtension=true|false]

옵션:
  --watch               감시 모드 활성화 (폴더 경로가 있으면 단일 폴더 감시, 없으면 watchTargets 설정 사용)
  --outputFile=<파일명> 생성할 index.ts 파일의 이름 (기본값: index.ts)
  --fileExtensions=<확장자> 감시할 파일 확장자 (예: .tsx,.ts)
  --exportStyle=<스타일> 생성할 export 스타일 (default, named, star, star-as, mixed, auto)  --namingConvention=<규칙> 파일명 변환 규칙 (camelCase, original, PascalCase)
  --namingConvention=<규칙> 파일명 변환 규칙 (camelCase, original, PascalCase)
  --fromWithExtension=<true|false> 파일 경로에 확장자 포함 여부 (기본값: true)
  -h, --help            도움말 출력

예시:
  auto-index src/components
  auto-index src/components --outputFile=index.ts
  auto-index src/components src/components/index.ts
  auto-index src/components --watch --exportStyle=named
  auto-index --watch (watchTargets 설정 사용)
`);
}

/**
 * CLI 메인 실행 함수
 * 명령행 인자를 파싱하고 적절한 모드로 실행합니다
 * - 일반 모드: 지정된 폴더에 index.ts 생성
 * - 감시 모드: 폴더 경로가 있으면 단일 폴더 감시, 없으면 watchTargets 설정 사용
 */
export function runCli(): void {
  const args = process.argv.slice(2);
  const { folderPath, outputPath, isWatch, isHelp, overrides } =
    parseCliArgs(args);

  // 도움말 출력
  if (isHelp) {
    printHelp();
    return;
  }

  if (isWatch && !folderPath) {
    // 감시 모드 + 폴더 경로 없음: watchTargets 설정 사용
    const config = getConfigFromPackageJson();
    console.log('🔍 watchTargets 설정으로 감시 모드 시작...');

    if (config.watchTargets && Array.isArray(config.watchTargets)) {
      config.watchTargets.forEach((target, index) => {
        if (target.watchPaths && Array.isArray(target.watchPaths)) {
          target.watchPaths.forEach((watchPath) => {
            console.log(`📁 감시 시작: ${watchPath}`);

            /**
             * package.json의 autoIndex 설정과 watchTargets의 개별 설정을 병합
             * - targetConfig: package.json에서 찾은 기본 설정
             * - target: watchTargets에서 정의된 개별 설정 (우선순위 높음)
             */
            const fullPath = path.resolve(watchPath);
            const targetConfig = findTargetConfig(fullPath, config);
            const finalConfig: WatchTargetConfig = {
              ...targetConfig,
              ...target,
            };

            // 병합된 설정으로 초기 인덱스 파일 생성
            generateIndex(watchPath, undefined, finalConfig);

            /**
             * Chokidar를 사용하여 파일 시스템 감시 모드 시작
             * - add: 새 파일 추가 시 인덱스 재생성
             * - unlink: 파일 삭제 시 인덱스 재생성
             * - change: 파일 변경 시 인덱스 재생성
             */
            const chokidar = require('chokidar');
            const outputFileName = finalConfig.outputFile || 'index.ts';

            const watcher = chokidar.watch(watchPath, {
              ignored: [
                /(^|[\/\\])\../, // 숨김 파일 무시
                new RegExp(`${outputFileName.replace('.', '\\.')}$`), // outputFile 무시
                /\.d\.ts$/, // 타입 정의 파일 무시
              ],
              persistent: true,
            });

            // 새 파일 추가 감지 시 인덱스 재생성
            watcher.on('add', (filePath: string) => {
              const fileName = path.basename(filePath);
              if (fileName === outputFileName || fileName.endsWith('.d.ts'))
                return;
              console.log(`📝 파일 추가: ${fileName} (${watchPath})`);
              generateIndex(watchPath, undefined, finalConfig);
            });

            // 파일 삭제 감지 시 인덱스 재생성
            watcher.on('unlink', (filePath: string) => {
              const fileName = path.basename(filePath);
              if (fileName === outputFileName || fileName.endsWith('.d.ts'))
                return;
              console.log(`🗑️  파일 삭제: ${fileName} (${watchPath})`);
              generateIndex(watchPath, undefined, finalConfig);
            });

            // 파일 변경 감지 시 인덱스 재생성
            watcher.on('change', (filePath: string) => {
              const fileName = path.basename(filePath);
              if (fileName === outputFileName || fileName.endsWith('.d.ts'))
                return;
              console.log(`📝 파일 변경: ${fileName} (${watchPath})`);
              generateIndex(watchPath, undefined, finalConfig);
            });
          });
        }
      });

      // 프로세스 종료 시 모든 감시 중지
      process.on('SIGINT', () => {
        console.log('\n🛑 감시 모드 종료...');
        process.exit(0);
      });

      return;
    } else {
      console.log('❌ watchTargets 설정을 찾을 수 없습니다.');
      return;
    }
  }

  if (!folderPath) {
    printHelp();
    return;
  }

  if (isWatch) {
    // 감시 모드 (기존 방식)
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

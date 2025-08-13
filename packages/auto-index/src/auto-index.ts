import fs from 'fs';
import path from 'path';
import { DEFAULT_WATCH_TARGETS_CONFIG } from './constant';
import { AutoIndexConfig, ParsedCliArgs, WatchTargetConfig } from './types';
import {
  getConfigFromPackageJson,
  parseBoolean,
  parseCommaSeparated,
  printHelp,
  transformFileName,
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
  let hasConfigOptions = false; // 설정 관련 옵션이 있는지 확인

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

      // 설정 관련 옵션이 있는지 확인
      if (
        [
          'watchPaths',
          'outputFile',
          'fileExtensions',
          'exportStyle',
          'namingConvention',
          'fromWithExtension',
        ].includes(key || '')
      ) {
        hasConfigOptions = true;
      }

      switch (key) {
        case 'watchPaths': {
          const paths =
            typeof val === 'string' ? parseCommaSeparated(val) : undefined;
          if (paths) overrides.watchPaths = paths;
          break;
        }
        case 'outputFile': {
          if (typeof val === 'string' && val) overrides.outputFile = val;
          break;
        }
        case 'fileExtensions': {
          const exts =
            typeof val === 'string' ? parseCommaSeparated(val) : undefined;
          if (exts)
            overrides.fileExtensions = exts.map((ext) =>
              ext.startsWith('.') ? ext : `.${ext}`
            );
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
        default: {
          printHelp();
          process.exit(1);
        }
      }
    } else {
      positionals.push(arg);
    }
  }

  const folderPath = positionals[0];

  // 모드 결정 - package.json 설정 존재 여부 확인
  let mode: ParsedCliArgs['mode'];

  // package.json 설정을 먼저 확인
  const config = getConfigFromPackageJson();
  const hasPackageConfig =
    config?.watchTargets && config.watchTargets.length > 0;

  if (hasPackageConfig && folderPath && hasConfigOptions) {
    mode = 'hybrid'; // CLI 설정 + package.json 설정 + 폴더 경로
  } else if (!hasPackageConfig && folderPath) {
    mode = 'cli-only'; // CLI 설정만
  } else if (hasPackageConfig) {
    mode = 'config-based'; // package.json 설정 기반
  } else {
    mode = 'cli-only'; // CLI 설정만, 기본값
  }

  return { mode, folderPath, isWatch, isHelp, overrides };
}

/**
 * 경로별 설정을 찾습니다
 * @param folderPath - 설정을 찾을 폴더 경로 (선택사항)
 * @param config - autoIndex 설정 객체
 * @param cliOverrides - CLI에서 전달된 설정 오버라이드 (선택사항)
 * @returns 해당 경로에 적용할 WatchTargetConfig 설정
 *
 * 동작 방식:
 * 1. folderPath가 있으면: watchTargets 설정에서 해당 경로와 매칭되는 설정 찾기
 * 2. folderPath가 없으면: watchTargets의 첫 번째 설정 사용
 * 3. glob 패턴과 정확한 경로 모두 지원
 * 4. 매칭되는 설정이 없으면 기본 설정 반환
 * 5. CLI 오버라이드 적용 (최우선)
 */
function findTargetConfig(
  folderPath: string | undefined,
  config: AutoIndexConfig,
  cliOverrides?: Partial<WatchTargetConfig>
): WatchTargetConfig {
  let targetConfig: WatchTargetConfig | undefined;

  // watchTargets 설정이 있는지 확인
  if (config.watchTargets && Array.isArray(config.watchTargets)) {
    if (folderPath) {
      // folderPath가 있는 경우: 경로 매칭
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
                  targetConfig = { ...DEFAULT_WATCH_TARGETS_CONFIG, ...target };
                  break;
                }
              }
            } else {
              // 정확한 경로 매칭
              if (relativePath === watchPath) {
                // 해당 target에 기본값 병합
                targetConfig = { ...DEFAULT_WATCH_TARGETS_CONFIG, ...target };
                break;
              }
            }
          }
          if (targetConfig) break;
        }
      }
    } else {
      // folderPath가 없는 경우: 첫 번째 설정 사용
      if (config.watchTargets.length > 0) {
        targetConfig = {
          ...DEFAULT_WATCH_TARGETS_CONFIG,
          ...config.watchTargets[0],
        };
      }
    }
  }

  // 매칭되는 설정이 없으면 기본값 사용
  if (!targetConfig) {
    targetConfig = { ...DEFAULT_WATCH_TARGETS_CONFIG };
  }

  // CLI 오버라이드 적용 (최우선)
  if (cliOverrides) {
    targetConfig = { ...targetConfig, ...cliOverrides };
  }

  return targetConfig;
}

/**
 * 컴포넌트 폴더를 스캔하여 index.ts 파일을 생성합니다
 * @param folderPath - 스캔할 폴더 경로 (선택사항)
 * @param cliOverrides - CLI에서 전달된 설정 오버라이드 (선택사항)
 *
 * 동작 방식:
 * 1. folderPath가 있으면: 지정된 폴더의 파일들을 스캔
 * 2. folderPath가 없으면: package.json의 watchTargets 설정 사용
 * 3. 설정된 확장자와 네이밍 규칙에 따라 export 문 생성
 * 4. index.ts 파일에 export 문들을 작성
 */
function generateIndex(
  folderPath: string | undefined,
  cliOverrides?: Partial<WatchTargetConfig>
): void {
  try {
    const config = getConfigFromPackageJson();

    if (folderPath) {
      // folderPath가 있는 경우: 특정 폴더 처리
      const fullPath = path.resolve(folderPath);

      if (!fs.existsSync(fullPath)) {
        console.error(`폴더가 존재하지 않습니다: ${folderPath}`);
        return;
      }

      // 모드별 설정 처리
      if (!config) {
        console.error('❌ package.json 설정을 읽을 수 없습니다.');
        return;
      }

      const targetConfig = findTargetConfig(folderPath, config, cliOverrides);

      console.log('🔍 설정 정보:', {
        folderPath,
        mode: 'hybrid',
        targetConfig,
        cliOverrides: cliOverrides || '없음',
      });

      const files = fs.readdirSync(fullPath);
      const componentFiles = files.filter((file: string) => {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);

        // 디렉토리는 제외
        if (stat.isDirectory()) {
          return false;
        }

        // 설정된 확장자와 일치하는지 확인
        const fileExt = path.extname(file);
        return targetConfig.fileExtensions.includes(fileExt);
      });

      if (componentFiles.length === 0) {
        console.log(`📁 ${folderPath}에 처리할 파일이 없습니다.`);
        return;
      }

      // export 문 생성
      const exportStatements: string[] = [];
      const outputFileName = targetConfig.outputFile || 'index.ts';

      componentFiles.forEach((file) => {
        const fileName = path.basename(file, path.extname(file));
        const transformedName = transformFileName(
          fileName,
          targetConfig.namingConvention
        );

        switch (targetConfig.exportStyle) {
          case 'named':
            exportStatements.push(
              `export { default as ${transformedName} } from './${fileName}';`
            );
            break;
          case 'default':
            exportStatements.push(`export { default } from './${fileName}';`);
            break;
          case 'star':
            exportStatements.push(`export * from './${fileName}';`);
            break;
          case 'star-as':
            exportStatements.push(
              `export * as ${transformedName} from './${fileName}';`
            );
            break;
          case 'mixed':
            exportStatements.push(
              `export { default as ${transformedName} } from './${fileName}';`
            );
            exportStatements.push(`export * from './${fileName}';`);
            break;
          case 'auto':
          default:
            // 파일 내용을 확인하여 default export가 있는지 확인
            const filePath = path.join(fullPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const hasDefaultExport =
              content.includes('export default') ||
              content.includes('export { default }');

            if (hasDefaultExport) {
              exportStatements.push(
                `export { default as ${transformedName} } from './${fileName}';`
              );
            } else {
              exportStatements.push(`export * from './${fileName}';`);
            }
            break;
        }
      });

      // index.ts 파일 생성
      const indexPath = path.join(fullPath, outputFileName);

      // outputFileName에 폴더가 포함되어 있는지 확인하고 필요한 폴더 생성
      const outputDir = path.dirname(indexPath);
      if (outputDir !== fullPath && !fs.existsSync(outputDir)) {
        console.log(`📁 폴더 생성: ${outputDir}`);
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const indexContent = exportStatements.join('\n') + '\n';

      fs.writeFileSync(indexPath, indexContent, 'utf-8');
      console.log(
        `✅ ${indexPath} 생성 완료 (${componentFiles.length}개 파일)`
      );
    } else {
      // folderPath가 없는 경우: package.json의 watchTargets 설정 사용
      if (!config || !config.watchTargets || config.watchTargets.length === 0) {
        console.log('❌ package.json에 autoIndex 설정이 없습니다.');
        return;
      }

      console.log('🔍 package.json 설정으로 인덱스 파일 생성...');

      config.watchTargets.forEach((target, index) => {
        if (target.watchPaths && Array.isArray(target.watchPaths)) {
          target.watchPaths.forEach((watchPath) => {
            console.log(`📁 처리 중: ${watchPath}`);
            generateIndex(watchPath, cliOverrides);
          });
        }
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('인덱스 생성 오류:', errorMessage);
  }
}

/**
 * 파일 감시 모드를 시작합니다
 * @param folderPath - 감시할 폴더 경로 (선택사항)
 * @param overrides - CLI 오버라이드 설정
 */
function startWatchMode(
  folderPath: string | undefined,
  overrides: Partial<WatchTargetConfig>
): void {
  const chokidar = require('chokidar');

  if (folderPath) {
    // 특정 폴더 감시
    console.log(`🔍 파일 변경 감지 시작: ${folderPath}`);

    const config = getConfigFromPackageJson();
    if (!config) {
      console.error('❌ package.json 설정을 읽을 수 없습니다.');
      return;
    }

    const targetConfig = findTargetConfig(folderPath, config, overrides);
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
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) return;
      console.log(`📝 파일 추가: ${fileName}`);
      generateIndex(folderPath, overrides);
    });

    watcher.on('unlink', (filePath: string) => {
      const fileName = path.basename(filePath);
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) return;
      console.log(`🗑️  파일 삭제: ${fileName}`);
      generateIndex(folderPath, overrides);
    });

    watcher.on('change', (filePath: string) => {
      const fileName = path.basename(filePath);
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) return;
      console.log(`📝 파일 변경: ${fileName}`);
      generateIndex(folderPath, overrides);
    });

    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  } else {
    // package.json의 watchTargets 설정으로 감시
    const config = getConfigFromPackageJson();
    if (!config || !config.watchTargets || config.watchTargets.length === 0) {
      console.log('❌ package.json에 autoIndex 설정이 없습니다.');
      return;
    }

    console.log('🔍 package.json 설정으로 감시 모드 시작...');

    const watchers: any[] = [];

    config.watchTargets.forEach((target, index) => {
      if (target.watchPaths && Array.isArray(target.watchPaths)) {
        target.watchPaths.forEach((watchPath) => {
          console.log(`📁 감시 시작: ${watchPath}`);

          const targetConfig = findTargetConfig(watchPath, config, overrides);
          const outputFileName = targetConfig.outputFile || 'index.ts';

          const watcher = chokidar.watch(watchPath, {
            ignored: [
              /(^|[\/\\])\../,
              new RegExp(`${outputFileName.replace('.', '\\.')}$`),
              /\.d\.ts$/,
            ],
            persistent: true,
          });

          watcher.on('add', (filePath: string) => {
            const fileName = path.basename(filePath);
            if (fileName === outputFileName || fileName.endsWith('.d.ts'))
              return;
            console.log(`📝 파일 추가: ${fileName} (${watchPath})`);
            generateIndex(watchPath, overrides);
          });

          watcher.on('unlink', (filePath: string) => {
            const fileName = path.basename(filePath);
            if (fileName === outputFileName || fileName.endsWith('.d.ts'))
              return;
            console.log(`🗑️  파일 삭제: ${fileName} (${watchPath})`);
            generateIndex(watchPath, overrides);
          });

          watcher.on('change', (filePath: string) => {
            const fileName = path.basename(filePath);
            if (fileName === outputFileName || fileName.endsWith('.d.ts'))
              return;
            console.log(`📝 파일 변경: ${fileName} (${watchPath})`);
            generateIndex(watchPath, overrides);
          });

          watchers.push(watcher);
        });
      }
    });

    // 프로세스 종료 시 모든 감시 중지
    process.on('SIGINT', () => {
      console.log('\n🛑 감시 모드 종료...');
      watchers.forEach((watcher) => watcher.close());
      process.exit(0);
    });
  }
}

/**
 * CLI 메인 실행 함수
 * 명령행 인자를 파싱하고 적절한 모드로 실행합니다
 * - 일반 모드: 지정된 폴더에 index.ts 생성
 * - 감시 모드: 폴더 경로가 있으면 단일 폴더 감시, 없으면 watchTargets 설정 사용
 */
export function runCli(): void {
  const args = process.argv.slice(2);
  const { mode, folderPath, isWatch, isHelp, overrides } = parseCliArgs(args);

  // 도움말 출력
  if (isHelp) {
    printHelp();
    return;
  }

  if (mode === 'hybrid') {
    // 하이브리드 모드: CLI 설정 + package.json 설정 + 폴더 경로
    if (isWatch) {
      startWatchMode(folderPath, overrides);
    } else {
      // 한 번만 실행
      generateIndex(folderPath, overrides);
    }
  } else if (mode === 'cli-only') {
    // CLI 설정만 사용
    if (!folderPath) {
      console.log('❌ CLI 설정 모드에서는 폴더 경로를 지정해야 합니다.');
      return;
    }

    if (isWatch) {
      startWatchMode(folderPath, overrides);
    } else {
      // 한 번만 실행
      generateIndex(folderPath, overrides);
    }
  } else {
    // config-based 모드: package.json 설정 기반
    if (isWatch) {
      // 감시 모드 (package.json의 watchTargets 사용)
      startWatchMode(undefined, overrides);
    } else {
      // 한 번만 실행
      if (folderPath) {
        generateIndex(folderPath, overrides);
      } else {
        // 폴더 경로가 없으면 package.json의 watchTargets 사용
        generateIndex(undefined, overrides);
      }
    }
  }
}

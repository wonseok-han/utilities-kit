#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 기본 설정값
 */
const DEFAULT_CONFIG = {
  exclude: ['node_modules', 'dist', '.git'],
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  outputFile: 'index.ts',
  exportStyle: 'named',
  namingConvention: 'original',
};

/**
 * 환경변수에서 설정을 읽어옵니다
 */
function getConfigFromEnv() {
  const configStr = process.env.AUTO_INDEX_CONFIG;
  if (configStr) {
    try {
      return JSON.parse(configStr);
    } catch (error) {
      console.error('설정 파싱 오류:', error.message);
    }
  }
  return DEFAULT_CONFIG;
}

/**
 * 파일명을 유효한 JavaScript 변수명으로 변환
 */
function toValidJSVariableName(str) {
  let validName = str.replace(/[^a-zA-Z0-9_]/g, '');
  if (/^[0-9]/.test(validName)) {
    validName = '_' + validName;
  }
  return validName;
}

/**
 * 파일명을 PascalCase로 변환
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 파일명을 CamelCase로 변환
 */
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 네이밍 규칙에 따라 파일명을 변환
 */
function transformFileName(name, namingConvention) {
  // 먼저 하이픈과 언더스코어를 제거하고 camelCase로 변환
  const camelCaseName = name.replace(/[-_]([a-z])/g, (match, letter) =>
    letter.toUpperCase()
  );

  switch (namingConvention) {
    case 'camelCase':
      return camelCaseName.charAt(0).toLowerCase() + camelCaseName.slice(1);
    case 'original':
      return toValidJSVariableName(name);
    case 'pascalCase':
    default:
      return camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);
  }
}

/**
 * 경로별 설정을 찾습니다
 */
function findTargetConfig(folderPath, config) {
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
                relativePath.startsWith(basePath) &&
                relativePath.includes(targetFolder)
              ) {
                // 해당 target에 기본값 병합
                return { ...DEFAULT_CONFIG, ...target };
              }
            }
          } else {
            // 정확한 경로 매칭
            if (relativePath === watchPath) {
              // 해당 target에 기본값 병합
              return { ...DEFAULT_CONFIG, ...target };
            }
          }
        }
      }
    }
  }

  return config;
}

/**
 * 컴포넌트 폴더를 스캔하여 index.ts 파일을 생성합니다
 */
function generateIndex(folderPath, outputPath) {
  try {
    const config = getConfigFromEnv();
    const fullPath = path.resolve(folderPath);

    if (!fs.existsSync(fullPath)) {
      console.error(`폴더가 존재하지 않습니다: ${folderPath}`);
      return;
    }

    // 경로별 설정 적용
    const targetConfig = findTargetConfig(fullPath, config);

    const files = fs.readdirSync(fullPath);
    const componentFiles = files.filter((file) => {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);

      // 폴더는 제외하고 설정된 확장자 파일만 포함
      return (
        stat.isFile() &&
        targetConfig.fileExtensions.some((ext) => file.endsWith(ext)) &&
        file !== targetConfig.outputFile &&
        !file.endsWith('.d.ts') // 타입 정의 파일 제외
      );
    });

    const exports = new Set(); // 중복 방지를 위해 Set 사용

    componentFiles.forEach((file) => {
      const name = path.parse(file).name;
      const exportName = transformFileName(name, targetConfig.namingConvention);

      // 파일 내용을 확인하여 default export가 있는지 체크
      const filePath = path.join(fullPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      if (content.includes('export default')) {
        // default export가 있으면 설정에 따라 처리
        if (targetConfig.exportStyle === 'default') {
          exports.add(`export { default } from './${name}';`);
        } else {
          exports.add(`export { default as ${exportName} } from './${name}';`);
        }
      } else {
        // default export가 없으면 named export로 생성
        // namingConvention에 따라 export 이름 결정
        if (targetConfig.namingConvention === 'original') {
          exports.add(`export * from './${name}';`);
        } else {
          exports.add(`export * as ${exportName} from './${name}';`);
        }
      }
    });

    // index.ts 파일 생성 (기존 내용 완전 삭제 후 새로 생성)
    const indexContent = Array.from(exports).join('\n') + '\n';
    const outputFilePath =
      outputPath || path.join(folderPath, targetConfig.outputFile);

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
    console.error('index.ts 생성 중 오류:', error);
  }
}

// CLI 실행
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('사용법: auto-index <폴더경로> [출력경로] [--watch]');
    console.log('예시: auto-index src/components');
    console.log('예시: auto-index src/components src/components/index.ts');
    console.log('예시: auto-index src/components --watch');
    return;
  }

  // --watch 옵션 제거하고 실제 인수 추출
  const cleanArgs = args.filter((arg) => arg !== '--watch');
  const folderPath = cleanArgs[0];
  const outputPath = cleanArgs[1];
  const isWatch = args.includes('--watch');

  if (isWatch) {
    // 감시 모드
    const chokidar = require('chokidar');
    console.log(`🔍 파일 변경 감지 시작: ${folderPath}`);

    const config = getConfigFromEnv();
    const outputFileName = config.outputFile || 'index.ts';

    const watcher = chokidar.watch(folderPath, {
      ignored: [
        /(^|[\/\\])\../, // 숨김 파일 무시
        new RegExp(`${outputFileName.replace('.', '\\.')}$`), // outputFile 무시
        /\.d\.ts$/, // 타입 정의 파일 무시
      ],
      persistent: true,
    });

    watcher.on('add', (filePath) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`📝 파일 추가: ${fileName}`);
      generateIndex(folderPath, outputPath);
    });

    watcher.on('unlink', (filePath) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`🗑️  파일 삭제: ${fileName}`);
      generateIndex(folderPath, outputPath);
    });

    watcher.on('change', (filePath) => {
      const fileName = path.basename(filePath);
      // outputFile은 무시
      if (fileName === outputFileName || fileName.endsWith('.d.ts')) {
        return;
      }
      console.log(`📝 파일 변경: ${fileName}`);
      generateIndex(folderPath, outputPath);
    });

    // 프로세스 종료 시 감시 중지
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  } else {
    // 한 번만 실행
    generateIndex(folderPath, outputPath);
  }
}

if (require.main === module) {
  main();
}

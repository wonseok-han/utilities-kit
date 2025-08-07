#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
 * 컴포넌트 폴더를 스캔하여 index.ts 파일을 생성합니다
 */
function generateIndex(folderPath, outputPath) {
  try {
    const fullPath = path.resolve(folderPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`폴더가 존재하지 않습니다: ${folderPath}`);
      return;
    }

    const files = fs.readdirSync(fullPath);
    const componentFiles = files.filter((file) => {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);

      // 폴더는 제외하고 .tsx, .ts 파일만 포함
      return (
        stat.isFile() &&
        (file.endsWith('.tsx') || file.endsWith('.ts')) &&
        file !== 'index.ts' &&
        file !== 'index.tsx'
      );
    });

    const exports = new Set(); // 중복 방지를 위해 Set 사용

    componentFiles.forEach((file) => {
      const name = path.parse(file).name;
      const exportName = toPascalCase(toValidJSVariableName(name));

      // 파일 내용을 확인하여 default export가 있는지 체크
      const filePath = path.join(fullPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      if (content.includes('export default')) {
        // default export가 있으면 default as named export로 생성
        exports.add(`export { default as ${exportName} } from './${name}';`);
      } else {
        // default export가 없으면 named export로 생성
        exports.add(`export * from './${name}';`);
      }
    });

    // index.ts 파일 생성 (기존 내용 완전 삭제 후 새로 생성)
    const indexContent = Array.from(exports).join('\n') + '\n';
    const outputFilePath = outputPath || path.join(folderPath, 'index.ts');

    // 기존 파일이 있으면 삭제하고 새로 생성
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }
    fs.writeFileSync(outputFilePath, indexContent, 'utf-8');
    console.log(`✅ index.ts 파일이 생성되었습니다: ${outputFilePath}`);
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
    // watch 모드
    const chokidar = require('chokidar');
    console.log(`🔍 파일 변경 감지 시작: ${folderPath}`);

    const watcher = chokidar.watch(folderPath, {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/index.ts',
        '**/index.tsx',
      ],
      persistent: true,
    });

    watcher
      .on('add', (filePath) => {
        console.log(`📝 파일 추가: ${path.basename(filePath)}`);
        generateIndex(folderPath, outputPath);
      })
      .on('change', (filePath) => {
        console.log(`📝 파일 변경: ${path.basename(filePath)}`);
        generateIndex(folderPath, outputPath);
      })
      .on('unlink', (filePath) => {
        console.log(`📝 파일 삭제: ${path.basename(filePath)}`);
        generateIndex(folderPath, outputPath);
      })
      .on('error', (error) => console.error('Watcher 오류:', error));
  } else {
    // 한 번만 실행
    generateIndex(folderPath, outputPath);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main();
}

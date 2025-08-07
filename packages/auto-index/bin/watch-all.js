#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * glob 패턴을 실제 경로로 변환합니다
 */
function globToPaths(pattern) {
  const results = [];

  // ** 패턴 처리
  if (pattern.includes('**')) {
    const parts = pattern.split('**/');
    if (parts.length === 2) {
      const basePath = parts[0];
      const targetFolder = parts[1];

      const absoluteBasePath = basePath.startsWith('/')
        ? basePath
        : path.resolve(process.cwd(), basePath);

      findFoldersByName(absoluteBasePath, targetFolder, results);
    }
  } else {
    // 일반 경로 처리
    const absolutePath = pattern.startsWith('/')
      ? pattern
      : path.resolve(process.cwd(), pattern);
    results.push(absolutePath);
  }

  return results;
}

/**
 * 주어진 경로에서 특정 이름의 폴더들을 재귀적으로 찾습니다
 */
function findFoldersByName(dir, targetFolderName, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return results;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const itemStat = fs.statSync(fullPath);

    if (itemStat.isDirectory()) {
      // 찾고자 하는 폴더를 발견하면 결과에 추가
      if (item === targetFolderName) {
        results.push(fullPath);
      }

      // node_modules, .git 등은 제외하고 재귀 탐색
      if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        findFoldersByName(fullPath, targetFolderName, results);
      }
    }
  }

  return results;
}

/**
 * 모든 지정된 경로들을 감시합니다
 */
function watchAllPaths(paths) {
  const allFolders = [];

  // 각 경로 처리
  paths.forEach((pathArg) => {
    // glob 패턴 처리
    if (pathArg.includes('**')) {
      const globPaths = globToPaths(pathArg);
      allFolders.push(...globPaths);
    } else {
      // 일반 경로 처리
      const absolutePath = pathArg.startsWith('/')
        ? pathArg
        : path.resolve(process.cwd(), pathArg);

      if (fs.existsSync(absolutePath)) {
        allFolders.push(absolutePath);
      } else {
        console.log(`⚠️  경로가 존재하지 않습니다: ${pathArg}`);
      }
    }
  });

  // 중복 제거
  const uniqueFolders = [...new Set(allFolders)];

  if (uniqueFolders.length === 0) {
    console.log('❌ 처리할 폴더를 찾을 수 없습니다.');
    return;
  }

  console.log(`🔍 감시할 폴더들:`);
  uniqueFolders.forEach((folder) => {
    const relativePath = path.relative(process.cwd(), folder);
    console.log(`  - ${relativePath}`);
  });

  // 각 폴더에 대해 auto-index 실행
  uniqueFolders.forEach((folder) => {
    const relativePath = path.relative(process.cwd(), folder);
    console.log(`📝 감시 시작: ${relativePath}`);

    // auto-index.js의 절대 경로 계산
    const autoIndexPath = path.resolve(__dirname, 'auto-index.js');

    const child = spawn('node', [autoIndexPath, folder, '--watch'], {
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      console.error(`❌ 오류: ${error.message}`);
    });
  });
}

// CLI 실행
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('사용법: auto-index-watch-all <path1> [path2] [path3] ...');
    console.log(
      '예시: auto-index-watch-all src/components "src/app/**/components"'
    );
    console.log(
      '예시: auto-index-watch-all "packages/**/utils" "src/**/hooks"'
    );
    process.exit(1);
  }

  console.log(`🚀 폴더 감시 시작: ${args.join(', ')}`);
  watchAllPaths(args);
}

if (require.main === module) {
  main();
}

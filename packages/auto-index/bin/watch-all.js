#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * 기본 설정값
 */
const DEFAULT_CONFIG = {
  exclude: ['node_modules'],
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  outputFile: 'index.ts',
  exportStyle: 'named',
  namingConvention: 'pascalCase',
};

/**
 * package.json에서 autoIndex 설정을 읽어옵니다
 */
function getAutoIndexConfig() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const config = packageJson.autoIndex;

    if (config) {
      // 기본값과 병합
      return { ...DEFAULT_CONFIG, ...config };
    }

    return null;
  } catch (error) {
    console.error('package.json 읽기 오류:', error.message);
    return null;
  }
}

/**
 * glob 패턴을 실제 경로로 변환합니다
 */
function globToPaths(pattern, config) {
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

      findFoldersByName(absoluteBasePath, targetFolder, results, config);
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
function findFoldersByName(
  dir,
  targetFolderName,
  results = [],
  config = DEFAULT_CONFIG
) {
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
      // 제외할 폴더인지 확인
      if (config.exclude.includes(item)) {
        continue;
      }

      // 찾고자 하는 폴더를 발견하면 결과에 추가
      if (item === targetFolderName) {
        results.push(fullPath);
      }

      // 재귀 탐색
      if (!item.startsWith('.')) {
        findFoldersByName(fullPath, targetFolderName, results, config);
      }
    }
  }

  return results;
}

/**
 * 모든 지정된 경로들을 감시합니다
 */
function watchAllPaths(paths, config = DEFAULT_CONFIG) {
  const allFolders = [];

  // 각 경로 처리
  paths.forEach((pathArg) => {
    // glob 패턴 처리
    if (pathArg.includes('**')) {
      const globPaths = globToPaths(pathArg, config);
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

    // 설정을 환경변수로 전달
    const env = {
      ...process.env,
      AUTO_INDEX_CONFIG: JSON.stringify(config),
    };

    const child = spawn('node', [autoIndexPath, folder, '--watch'], {
      stdio: 'inherit',
      env,
    });

    child.on('error', (error) => {
      console.error(`❌ 오류: ${error.message}`);
    });
  });
}

// CLI 실행
function main() {
  const args = process.argv.slice(2);

  // 인자가 없으면 package.json에서 설정 읽기
  if (args.length === 0) {
    const config = getAutoIndexConfig();

    if (config && config.watchPaths) {
      console.log('📋 package.json에서 autoIndex 설정을 읽어옵니다.');
      console.log(`🚀 폴더 감시 시작: ${config.watchPaths.join(', ')}`);
      console.log(`⚙️  설정:`, {
        exclude: config.exclude,
        fileExtensions: config.fileExtensions,
        outputFile: config.outputFile,
        exportStyle: config.exportStyle,
        namingConvention: config.namingConvention,
      });
      watchAllPaths(config.watchPaths, config);
      return;
    }

    console.log('사용법: auto-index-watch-all <path1> [path2] [path3] ...');
    console.log(
      '예시: auto-index-watch-all src/components "src/app/**/components"'
    );
    console.log(
      '예시: auto-index-watch-all "packages/**/utils" "src/**/hooks"'
    );
    console.log('');
    console.log('또는 package.json에 autoIndex 설정을 추가하세요:');
    console.log('{');
    console.log('  "autoIndex": {');
    console.log('    "watchPaths": [');
    console.log('      "src/components",');
    console.log('      "src/app/**/components"');
    console.log('    ],');
    console.log('    "exclude": ["node_modules", "dist"],');
    console.log('    "fileExtensions": [".tsx", ".ts"],');
    console.log('    "outputFile": "index.ts",');
    console.log('    "exportStyle": "named",');
    console.log('    "namingConvention": "pascalCase"');
    console.log('  }');
    console.log('}');
    process.exit(1);
  }

  console.log(`🚀 폴더 감시 시작: ${args.join(', ')}`);
  watchAllPaths(args);
}

if (require.main === module) {
  main();
}

#!/usr/bin/env node

/**
 * auto-index CLI 실행 파일
 * src의 TypeScript 모듈을 dynamic import로 로드합니다.
 */

async function main() {
  try {
    // dist의 컴파일된 auto-index 모듈을 dynamic import로 로드
    const { runCli } = await import('../dist/auto-index.js');

    // CLI 실행
    runCli();
  } catch (error) {
    console.error('auto-index 모듈 로드 중 오류:', error.message);
    console.error('TypeScript 컴파일이 필요할 수 있습니다.');
    process.exit(1);
  }
}

// 메인 함수 실행
if (require.main === module) {
  main();
}

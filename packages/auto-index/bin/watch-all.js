#!/usr/bin/env node

/**
 * auto-index-watch-all CLI 실행 파일
 * src의 TypeScript 모듈을 dynamic import로 로드합니다.
 */

async function main() {
  try {
    // src의 watch-all 모듈을 dynamic import로 로드
    const { runCli } = await import('../dist/watch-all.js');

    // CLI 실행
    runCli();
  } catch (error) {
    console.error('watch-all 모듈 로드 중 오류:', error.message);
    console.error('TypeScript 컴파일이 필요할 수 있습니다.');
    process.exit(1);
  }
}

// 메인 함수 실행
if (require.main === module) {
  main();
}

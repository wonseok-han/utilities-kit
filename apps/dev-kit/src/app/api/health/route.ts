import { NextResponse } from 'next/server';

import packageJson from '../../../../package.json';

/**
 * 헬스체크 API 엔드포인트
 */
export async function GET() {
  try {
    // 기본적인 애플리케이션 상태 확인
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: packageJson.version,
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    // 에러 발생 시 unhealthy 상태 반환
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

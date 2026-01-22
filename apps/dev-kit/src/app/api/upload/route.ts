import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

/**
 * 파일 업로드 API 엔드포인트
 * POST /api/upload - 파일을 업로드하고 경로를 반환
 *
 * 실제 구현에서는 S3나 다른 스토리지에 업로드하고 경로를 반환합니다.
 * 현재는 가정용으로 파일명을 기반으로 경로를 반환합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 허용된 파일 타입 확인
    const allowedTypes = ['image/', 'video/'];
    const isValidType = allowedTypes.some((type) => file.type.startsWith(type));
    if (!isValidType) {
      return NextResponse.json(
        { error: '이미지 또는 영상 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 실제 구현에서는 여기서 S3나 다른 스토리지에 업로드합니다
    // 예시: const url = await uploadToS3(file);
    // 현재는 가정용으로 파일명을 기반으로 경로를 반환합니다
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      path: filePath,
      url: filePath, // 실제 URL로 사용될 경로
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      {
        error: '파일 업로드 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

import type { NextRequest } from 'next/server';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { NextResponse } from 'next/server';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_PREFIXES = ['image/', 'video/'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      return NextResponse.json(
        { error: '이미지 또는 영상 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 업로드 디렉토리 생성
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // 파일 저장
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = join(UPLOAD_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, buffer);

    const url = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

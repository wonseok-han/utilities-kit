import { IndexGenerator } from './index-generator';

/**
 * 간단한 index.ts 생성 함수
 * @param folderPath 컴포넌트 폴더 경로
 * @param outputPath 출력 파일 경로 (선택사항)
 */
export function generateIndex(folderPath: string, outputPath?: string): void {
  IndexGenerator.generateIndex(folderPath, outputPath);
}

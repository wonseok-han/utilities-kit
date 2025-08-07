import * as fs from 'fs';
import * as path from 'path';

/**
 * 컴포넌트 폴더를 스캔하여 index.ts 파일을 자동 생성하는 클래스
 */
export class IndexGenerator {
  /**
   * 지정된 폴더의 모든 컴포넌트를 스캔하여 index.ts 파일을 생성합니다
   * @param folderPath 스캔할 폴더 경로
   * @param outputPath 출력할 index.ts 파일 경로 (기본값: folderPath/index.ts)
   */
  static generateIndex(folderPath: string, outputPath?: string): void {
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

      const exports: string[] = [];

      componentFiles.forEach((file) => {
        const name = path.parse(file).name;
        const filePath = path.join(fullPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // export된 컴포넌트 이름 추출
        const exportNames = this.extractExports(content, name);

        exportNames.forEach((exportName) => {
          exports.push(`export { ${exportName} } from './${name}';`);
        });
      });

      // index.ts 파일 생성
      const indexContent = exports.join('\n') + '\n';
      const outputFilePath = outputPath || path.join(folderPath, 'index.ts');

      fs.writeFileSync(outputFilePath, indexContent, 'utf-8');
      console.log(`✅ index.ts 파일이 생성되었습니다: ${outputFilePath}`);
      console.log(`📦 총 ${exports.length}개의 export가 추가되었습니다.`);
    } catch (error) {
      console.error('index.ts 생성 중 오류:', error);
    }
  }

  /**
   * 파일 내용에서 export된 이름들을 추출합니다
   * @param content 파일 내용
   * @param fileName 파일명
   * @returns export된 이름들의 배열
   */
  private static extractExports(content: string, fileName: string): string[] {
    const exports: string[] = [];

    // export default 구문 찾기
    const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
    if (defaultExportMatch && defaultExportMatch[1]) {
      exports.push(defaultExportMatch[1]);
    }

    // named export 구문 찾기 (const, function, class)
    const namedExportMatches = content.match(
      /export\s+(?:const|function|class)\s+(\w+)/g
    );
    if (namedExportMatches) {
      namedExportMatches.forEach((match) => {
        const nameMatch = match.match(
          /export\s+(?:const|function|class)\s+(\w+)/
        );
        if (nameMatch && nameMatch[1]) {
          exports.push(nameMatch[1]);
        }
      });
    }

    // export { ... } 구문 찾기
    const exportBlockMatches = content.match(/export\s*{\s*([^}]+)\s*}/g);
    if (exportBlockMatches) {
      exportBlockMatches.forEach((match) => {
        const namesMatch = match.match(/export\s*{\s*([^}]+)\s*}/);
        if (namesMatch && namesMatch[1]) {
          const names = namesMatch[1]!.split(',').map((name) => name.trim());
          exports.push(...names);
        }
      });
    }

    // export default가 없고 named export도 없으면 파일명을 PascalCase로 사용
    if (exports.length === 0) {
      exports.push(fileName.charAt(0).toUpperCase() + fileName.slice(1));
    }

    return exports;
  }
}

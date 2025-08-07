import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { IndexGenerator } from './index-generator';

/**
 * 파일 변경을 감지하여 자동으로 index.ts 파일을 업데이트하는 클래스
 */
export class AutoIndexWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private targetFolder: string;
  private indexPath: string;

  constructor(targetFolder: string, indexPath?: string) {
    this.targetFolder = path.resolve(targetFolder);
    this.indexPath = indexPath || path.join(this.targetFolder, 'index.ts');
  }

  /**
   * 파일 변경 감지를 시작합니다
   */
  start(): void {
    if (!fs.existsSync(this.targetFolder)) {
      console.error(`폴더가 존재하지 않습니다: ${this.targetFolder}`);
      return;
    }

    console.log(`🔍 파일 변경 감지를 시작합니다: ${this.targetFolder}`);

    this.watcher = chokidar.watch(this.targetFolder, {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/index.ts',
        '**/index.tsx',
      ],
      persistent: true,
    });

    this.watcher
      .on('add', (filePath) => this.handleFileChange(filePath, 'add'))
      .on('change', (filePath) => this.handleFileChange(filePath, 'change'))
      .on('unlink', (filePath) => this.handleFileChange(filePath, 'unlink'))
      .on('error', (error) => console.error('Watcher 오류:', error));
  }

  /**
   * 파일 변경 감지를 중지합니다
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('🛑 파일 변경 감지를 중지했습니다.');
    }
  }

  /**
   * 파일 변경 이벤트를 처리합니다
   */
  private handleFileChange(
    filePath: string,
    event: 'add' | 'change' | 'unlink'
  ): void {
    const relativePath = path.relative(this.targetFolder, filePath);
    const ext = path.extname(filePath);

    // .tsx, .ts 파일만 처리
    if (ext !== '.tsx' && ext !== '.ts') {
      return;
    }

    console.log(`📝 파일 ${event}: ${relativePath}`);

    // index.ts 파일 업데이트
    IndexGenerator.generateIndex(this.targetFolder, this.indexPath);
  }

  /**
   * 한 번만 index.ts를 생성합니다 (watcher 없이)
   */
  static generateOnce(folderPath: string, indexPath?: string): void {
    IndexGenerator.generateIndex(folderPath, indexPath);
  }
}

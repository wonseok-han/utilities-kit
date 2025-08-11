// 기본 설정 타입 정의
export interface WatchTargetConfig {
  watchPaths: string[];
  fileExtensions: string[];
  outputFile: string;
  exportStyle: 'default' | 'named' | 'star' | 'star-as' | 'mixed' | 'auto';
  namingConvention: 'camelCase' | 'PascalCase' | 'original';
  fromWithExtension: boolean;
}

export interface AutoIndexConfig {
  watchTargets: WatchTargetConfig[];
  log: boolean;
}

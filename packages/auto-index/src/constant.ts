import { AutoIndexConfig, WatchTargetConfig } from './types';

export const DEFAULT_WATCH_TARGETS_CONFIG: WatchTargetConfig = {
  watchPaths: [],
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  outputFile: 'index.ts',
  exportStyle: 'auto',
  namingConvention: 'original',
  fromWithExtension: false, // from 경로에 확장자를 포함할지 여부
};

export const DEFAULT_CONFIG: AutoIndexConfig = {
  watchTargets: [DEFAULT_WATCH_TARGETS_CONFIG],
  log: true,
};

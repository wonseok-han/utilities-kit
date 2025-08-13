export type WatchTargetConfig = {
  watchPaths: string[];
  fileExtensions: string[];
  outputFile: string;
  exportStyle: 'default' | 'named' | 'star' | 'star-as' | 'mixed' | 'auto';
  namingConvention: 'camelCase' | 'PascalCase' | 'original';
  fromWithExtension: boolean;
};

export type AutoIndexConfig = {
  watchTargets: WatchTargetConfig[];
  log: boolean;
};

export type ParsedCliArgs = {
  mode: 'cli-only' | 'config-based' | 'hybrid';
  folderPath?: string;
  isWatch: boolean;
  isHelp: boolean;
  overrides: Partial<WatchTargetConfig>;
};

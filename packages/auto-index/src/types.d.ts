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
  folderPath?: string;
  outputPath?: string;
  isWatch: boolean;
  isHelp: boolean;
  overrides: Partial<WatchTargetConfig>;
};

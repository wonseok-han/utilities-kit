export type TargetConfig = {
  paths: string[];
  fileExtensions: string[];
  outputFile: string;
  exportStyle: 'default' | 'named' | 'star' | 'star-as' | 'mixed' | 'auto';
  namingConvention: 'camelCase' | 'PascalCase' | 'original';
  fromWithExtension: boolean;
  excludes: string[];
};

export type AutoIndexConfig = {
  targets: TargetConfig[];
  log: boolean;
};

export type ParsedCliArgs = {
  mode: 'cli-only' | 'config-based' | 'hybrid';
  overrides: Partial<TargetConfig>;
  isWatch: boolean;
  isHelp: boolean;
};

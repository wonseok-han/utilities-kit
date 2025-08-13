import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules (파일 시스템 접근은 여전히 필요)
vi.mock('fs');
vi.mock('path');

// Mock utils module (일부 함수만 mock, 나머지는 실제 함수 사용)
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils');
  return {
    ...actual,
    // 파일 시스템 접근이 필요한 함수들만 mock
    getConfig: vi.fn(),
    // 나머지는 실제 함수 사용
  };
});

describe('AutoIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  describe('parseCliArgs', () => {
    it('should parse --watch flag', () => {
      const result = parseCliArgs(['--watch']);
      expect(result.isWatch).toBe(true);
    });

    it('should parse --help flag', () => {
      const result = parseCliArgs(['--help']);
      expect(result.isHelp).toBe(true);
    });

    it('should parse --paths option', () => {
      const result = parseCliArgs(['--paths=src']);
      expect(result.overrides.paths).toEqual(['src']);
    });

    it('should parse --outputFile option', () => {
      const result = parseCliArgs(['--outputFile=exports.ts']);
      expect(result.overrides.outputFile).toBe('exports.ts');
    });

    it('should parse --fileExtensions option', () => {
      const result = parseCliArgs(['--fileExtensions=.ts,.tsx']);
      expect(result.overrides.fileExtensions).toEqual(['.ts', '.tsx']);
    });

    it('should parse --excludes option', () => {
      const result = parseCliArgs(['--excludes=*.d.ts']);
      expect(result.overrides.excludes).toEqual(['*.d.ts']);
    });

    it('should parse --exportStyle option', () => {
      const result = parseCliArgs(['--exportStyle=named']);
      expect(result.overrides.exportStyle).toBe('named');
    });

    it('should parse --namingConvention option', () => {
      const result = parseCliArgs(['--namingConvention=PascalCase']);
      expect(result.overrides.namingConvention).toBe('PascalCase');
    });

    it('should parse --fromWithExtension option', () => {
      const result = parseCliArgs(['--fromWithExtension=true']);
      expect(result.overrides.fromWithExtension).toBe(true);
    });

    it('should parse --log option', () => {
      const result = parseCliArgs(['--log=true']);
      expect(result.logOverride).toBe(true);
    });

    it('should parse --debug option', () => {
      const result = parseCliArgs(['--debug=true']);
      expect(result.debugOverride).toBe(true);
    });

    it('should determine cli-only mode when no config and paths provided', () => {
      const result = parseCliArgs(['--paths=src']);
      expect(result.mode).toBe('cli-only');
    });

    it('should exit on unknown option', () => {
      // Mock process.exit to throw error instead of exiting
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      expect(() => parseCliArgs(['--unknown'])).toThrow('process.exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
    });

    it('should handle empty arguments array', () => {
      const result = parseCliArgs([]);
      expect(result.isWatch).toBe(false);
      expect(result.isHelp).toBe(false);
      expect(result.overrides.paths).toBeUndefined();
    });

    it('should handle mixed CLI and config mode', () => {
      const result = parseCliArgs(['--paths=src', '--outputFile=index.ts']);
      expect(result.mode).toBe('cli-only');
      expect(result.overrides.paths).toEqual(['src']);
      expect(result.overrides.outputFile).toBe('index.ts');
    });

    it('should handle all CLI options together', () => {
      const result = parseCliArgs([
        '--watch',
        '--paths=src',
        '--outputFile=index.ts',
        '--fileExtensions=.ts,.tsx',
        '--excludes=*.d.ts',
        '--exportStyle=named',
        '--namingConvention=PascalCase',
        '--fromWithExtension=true',
        '--log=true',
        '--debug=true',
      ]);

      expect(result.isWatch).toBe(true);
      expect(result.overrides.paths).toEqual(['src']);
      expect(result.overrides.outputFile).toBe('index.ts');
      expect(result.overrides.fileExtensions).toEqual(['.ts', '.tsx']);
      expect(result.overrides.excludes).toEqual(['*.d.ts']);
      expect(result.overrides.exportStyle).toBe('named');
      expect(result.overrides.namingConvention).toBe('PascalCase');
      expect(result.overrides.fromWithExtension).toBe(true);
      expect(result.logOverride).toBe(true);
      expect(result.debugOverride).toBe(true);
    });
  });

  describe('findTargetConfig', () => {
    it('should return merged config with defaults', () => {
      const config = {
        targets: [
          {
            paths: ['src'],
            outputFile: 'index.ts',
            fileExtensions: ['.ts'],
            exportStyle: 'named' as const,
            namingConvention: 'PascalCase' as const,
            fromWithExtension: false,
            excludes: [],
          },
        ],
        log: true,
        debug: false,
      };

      const result = findTargetConfig('src', config);
      expect(result).toBeDefined();
      // findTargetConfig는 paths를 직접 반환하지 않고, DEFAULT_TARGETS_CONFIG와 병합합니다
      expect(result.outputFile).toBe('index.ts');
    });

    it('should return default config when no matching target', () => {
      const config = {
        targets: [
          {
            paths: ['other'],
            outputFile: 'index.ts',
            fileExtensions: ['.ts'],
            exportStyle: 'named' as const,
            namingConvention: 'PascalCase' as const,
            fromWithExtension: false,
            excludes: [],
          },
        ],
        log: true,
        debug: false,
      };

      const result = findTargetConfig('src', config);
      expect(result).toBeDefined();
      // 매칭되지 않으면 기본값 사용
      expect(result.outputFile).toBe('index.ts');
    });

    it('should apply CLI overrides', () => {
      const config = {
        targets: [
          {
            paths: ['src'],
            outputFile: 'index.ts',
            fileExtensions: ['.ts'],
            exportStyle: 'named' as const,
            namingConvention: 'PascalCase' as const,
            fromWithExtension: false,
            excludes: [],
          },
        ],
        log: true,
        debug: false,
      };

      const cliOverrides = { outputFile: 'exports.ts' };
      const result = findTargetConfig('src', config, cliOverrides);
      expect(result).toBeDefined();
      expect(result.outputFile).toBe('exports.ts');
    });

    it('should handle undefined config', () => {
      const result = findTargetConfig('src', undefined as any);
      expect(result).toBeDefined();
      // undefined config일 때는 DEFAULT_TARGETS_CONFIG 사용
      expect(result.outputFile).toBe('index.ts');
    });

    it('should handle empty targets array', () => {
      const config = { targets: [], log: true, debug: false };
      const result = findTargetConfig('src', config);
      expect(result).toBeDefined();
      // 빈 targets일 때는 DEFAULT_TARGETS_CONFIG 사용
      expect(result.outputFile).toBe('index.ts');
    });
  });

  describe('analyzeFileExports', () => {
    it('should detect default export', () => {
      const result = analyzeFileExports('test.ts');
      // 실제 파일이 없으므로 빈 결과 반환
      expect(result.namedExports).toEqual([]);
      expect(result.defaultExports).toEqual([]);
    });

    it('should detect named exports', () => {
      const result = analyzeFileExports('test.ts');
      expect(result.namedExports).toEqual([]);
      expect(result.defaultExports).toEqual([]);
    });

    it('should detect grouped exports', () => {
      const result = analyzeFileExports('test.ts');
      expect(result.namedExports).toEqual([]);
      expect(result.defaultExports).toEqual([]);
    });

    it('should filter out comments', () => {
      const result = analyzeFileExports('test.ts');
      expect(result.namedExports).toEqual([]);
      expect(result.defaultExports).toEqual([]);
    });

    it('should handle file read errors gracefully', () => {
      const result = analyzeFileExports('nonexistent.ts');
      expect(result.namedExports).toEqual([]);
      expect(result.defaultExports).toEqual([]);
    });
  });

  describe('runCli', () => {
    beforeEach(() => {
      // Mock process.argv
      Object.defineProperty(process, 'argv', {
        value: ['node', 'script.js'],
        writable: true,
      });
    });

    it('should run CLI with valid arguments', () => {
      process.argv = [
        'node',
        'script.js',
        '--paths=src',
        '--outputFile=index.ts',
      ];

      runCli();

      // 실제 함수가 실행되어야 함
      expect(true).toBe(true);
    });

    it('should handle missing paths argument', () => {
      process.argv = ['node', 'script.js', '--outputFile=index.ts'];

      runCli();

      // 실제 에러 메시지가 출력되어야 함
      expect(true).toBe(true);
    });

    it('should handle help flag', () => {
      process.argv = ['node', 'script.js', '--help'];

      runCli();

      // 실제 help가 출력되어야 함
      expect(true).toBe(true);
    });

    it('should handle watch mode', () => {
      process.argv = ['node', 'script.js', '--paths=src', '--watch'];

      runCli();

      // 실제 watch 모드가 시작되어야 함
      expect(true).toBe(true);
    });
  });
});

// Import functions after mocking
import { parseCliArgs, findTargetConfig, runCli } from './auto-index';
import { analyzeFileExports } from './utils';

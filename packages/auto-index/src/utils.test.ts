import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  parseBoolean,
  parseCommaSeparated,
  toValidJSVariableName,
  transformFileName,
  setLoggingConfig,
  log,
  error,
  warn,
  info,
} from './utils';

// Mock fs module
vi.mock('fs');
vi.mock('path');

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset logging config
    setLoggingConfig(true, false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseBoolean', () => {
    it('should parse "true" string to true', () => {
      expect(parseBoolean('true')).toBe(true);
    });

    it('should parse "false" string to false', () => {
      expect(parseBoolean('false')).toBe(false);
    });

    it('should return true for boolean true', () => {
      expect(parseBoolean(true)).toBe(true);
    });

    it('should return undefined for undefined', () => {
      expect(parseBoolean(undefined)).toBeUndefined();
    });

    it('should return undefined for invalid string', () => {
      expect(parseBoolean('invalid')).toBeUndefined();
    });
  });

  describe('parseCommaSeparated', () => {
    it('should parse comma-separated string to array', () => {
      expect(parseCommaSeparated('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should trim whitespace', () => {
      expect(parseCommaSeparated(' a , b , c ')).toEqual(['a', 'b', 'c']);
    });

    it('should filter empty values', () => {
      expect(parseCommaSeparated('a,,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('should return undefined for empty string', () => {
      expect(parseCommaSeparated('')).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      expect(parseCommaSeparated(undefined)).toBeUndefined();
    });
  });

  describe('toValidJSVariableName', () => {
    it('should remove invalid characters', () => {
      expect(toValidJSVariableName('user-name')).toBe('username');
    });

    it('should add underscore prefix for numbers', () => {
      expect(toValidJSVariableName('123name')).toBe('_123name');
    });

    it('should preserve valid characters', () => {
      expect(toValidJSVariableName('userName_123')).toBe('userName_123');
    });
  });

  describe('transformFileName', () => {
    it('should transform to camelCase', () => {
      expect(transformFileName('user-profile', 'camelCase')).toBe(
        'userProfile'
      );
    });

    it('should transform to PascalCase', () => {
      expect(transformFileName('user-profile', 'PascalCase')).toBe(
        'UserProfile'
      );
    });

    it('should use original naming convention', () => {
      expect(transformFileName('user-profile', 'original')).toBe('userprofile');
    });

    it('should handle underscores', () => {
      expect(transformFileName('user_profile', 'camelCase')).toBe(
        'userProfile'
      );
    });

    it('should default to PascalCase', () => {
      expect(transformFileName('user-profile', 'PascalCase')).toBe(
        'UserProfile'
      );
    });
  });

  describe('Logging Functions', () => {
    let consoleSpy: {
      log: any;
      error: any;
      warn: any;
      info: any;
    };

    beforeEach(() => {
      consoleSpy = {
        log: vi.spyOn(console, 'log').mockImplementation(() => {}),
        error: vi.spyOn(console, 'error').mockImplementation(() => {}),
        warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
        info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      };
    });

    afterEach(() => {
      Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    });

    it('should call console.log when log is enabled', () => {
      setLoggingConfig(true, false);
      log('test message');
      expect(consoleSpy.log).toHaveBeenCalledWith('test message');
    });

    it('should not call console.log when log is disabled', () => {
      setLoggingConfig(false, false);
      log('test message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should call console.error when log is enabled', () => {
      setLoggingConfig(true, false);
      error('test error');
      expect(consoleSpy.error).toHaveBeenCalledWith('test error');
    });

    it('should not call console.error when log is disabled', () => {
      setLoggingConfig(false, false);
      error('test error');
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should call console.warn when log is enabled', () => {
      setLoggingConfig(true, false);
      warn('test warning');
      expect(consoleSpy.warn).toHaveBeenCalledWith('test warning');
    });

    it('should not call console.warn when log is disabled', () => {
      setLoggingConfig(false, false);
      warn('test warning');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should call console.info when debug is enabled', () => {
      setLoggingConfig(true, true);
      info('test info');
      expect(consoleSpy.info).toHaveBeenCalledWith('test info');
    });

    it('should not call console.info when debug is disabled', () => {
      setLoggingConfig(true, false);
      info('test info');
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });
  });
});

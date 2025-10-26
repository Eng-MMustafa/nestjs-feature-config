/**
 * Utility functions for generating injection tokens and configuration management
 */

/**
 * Generates a unique injection token for a feature configuration
 *
 * @param featureName - Name of the feature (e.g., 'STORAGE', 'EMAIL')
 * @returns Injection token string
 *
 * @example
 * ```typescript
 * const STORAGE_CONFIG_TOKEN = generateConfigToken('STORAGE');
 * // Returns: 'FEATURE_CONFIG_STORAGE'
 * ```
 */
export function generateConfigToken(featureName: string): string {
  const normalizedName = featureName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `FEATURE_CONFIG_${normalizedName}`;
}

/**
 * Generates environment variable prefix for a feature
 *
 * @param featureName - Name of the feature
 * @returns Environment variable prefix
 *
 * @example
 * ```typescript
 * const prefix = generateEnvPrefix('storage');
 * // Returns: 'STORAGE_'
 * ```
 */
export function generateEnvPrefix(featureName: string): string {
  return `${featureName.toUpperCase()}_`;
}

/**
 * Extracts environment variables with a specific prefix
 *
 * @param prefix - Environment variable prefix
 * @param env - Environment variables object (defaults to process.env)
 * @returns Object with filtered environment variables (keys without prefix)
 *
 * @example
 * ```typescript
 * // Given: STORAGE_PROVIDER=s3, STORAGE_BUCKET=my-bucket
 * const config = extractEnvWithPrefix('STORAGE_');
 * // Returns: { PROVIDER: 's3', BUCKET: 'my-bucket' }
 * ```
 */
export function extractEnvWithPrefix(
  prefix: string,
  env: Record<string, string | undefined> = process.env,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  
  Object.keys(env).forEach(key => {
    if (key.startsWith(prefix)) {
      const newKey = key.substring(prefix.length);
      result[newKey] = env[key];
    }
  });
  
  return result;
}

/**
 * Converts environment variable keys to camelCase property names
 *
 * @param envVars - Object with environment variables
 * @returns Object with camelCase keys
 *
 * @example
 * ```typescript
 * const input = { STORAGE_PROVIDER: 's3', AWS_ACCESS_KEY_ID: 'key123' };
 * const output = convertEnvKeysToCamelCase(input);
 * // Returns: { storageProvider: 's3', awsAccessKeyId: 'key123' }
 * ```
 */
export function convertEnvKeysToCamelCase(
  envVars: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  
  Object.entries(envVars).forEach(([key, value]) => {
    const camelCaseKey = key
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelCaseKey] = value;
  });
  
  return result;
}

/**
 * Type-safe environment variable parser
 */
export class EnvParser {
  /**
   * Parses string environment variable
   *
   * @param value - Environment variable value
   * @param defaultValue - Default value if not provided
   * @returns Parsed string value
   */
  static string(value: string | undefined, defaultValue?: string): string | undefined {
    return value ?? defaultValue;
  }

  /**
   * Parses number environment variable
   *
   * @param value - Environment variable value
   * @param defaultValue - Default value if not provided
   * @returns Parsed number value
   */
  static number(value: string | undefined, defaultValue?: number): number | undefined {
    if (value === undefined) return defaultValue;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Parses boolean environment variable
   *
   * @param value - Environment variable value
   * @param defaultValue - Default value if not provided
   * @returns Parsed boolean value
   */
  static boolean(value: string | undefined, defaultValue?: boolean): boolean | undefined {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  /**
   * Parses array environment variable (comma-separated)
   *
   * @param value - Environment variable value
   * @param defaultValue - Default value if not provided
   * @returns Parsed array value
   */
  static array(value: string | undefined, defaultValue?: string[]): string[] | undefined {
    if (value === undefined) return defaultValue;
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  /**
   * Parses JSON environment variable
   *
   * @param value - Environment variable value
   * @param defaultValue - Default value if not provided
   * @returns Parsed JSON value
   */
  static json<T = any>(value: string | undefined, defaultValue?: T): T | undefined {
    if (value === undefined) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }
}

/**
 * Configuration validation error details
 */
export interface ValidationErrorDetail {
  property: string;
  value: any;
  constraints: Record<string, string>;
}

/**
 * Configuration validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorDetail[];
  config?: any;
}

/**
 * Formats validation errors for better readability
 *
 * @param errors - Array of validation error details
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: ValidationErrorDetail[]): string {
  if (errors.length === 0) {
    return 'Configuration is valid';
  }

  const errorMessages = errors.map(error => {
    const constraints = Object.values(error.constraints).join(', ');
    return `  - ${error.property}: ${constraints}`;
  });

  return `Configuration validation failed:\n${errorMessages.join('\n')}`;
}

/**
 * Merges multiple configuration objects with type safety
 *
 * @param configs - Array of configuration objects to merge
 * @returns Merged configuration object
 */
export function mergeConfigurations<T extends Record<string, any>>(...configs: Partial<T>[]): T {
  const result: Record<string, any> = {};
  for (const config of configs) {
    Object.assign(result, config);
  }
  return result as T;
}

/**
 * Deep freezes an object to prevent runtime modifications
 *
 * @param obj - Object to freeze
 * @returns Frozen object
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  
  return Object.freeze(obj);
}
/**
 * NestJS Feature Config - Main Export File
 * 
 * A comprehensive type-safe configuration management library for NestJS
 * that supports conditional validation and dynamic module registration.
 */

// Core module and decorators
export { FeatureConfigModule, InjectFeatureConfig } from './modules/feature-config.module';
export type { FeatureConfigOptions } from './modules/feature-config.module';

// Custom validation decorators
export {
    ConditionHelpers, IsRequiredIf,
    IsRequiredIfConstraint, LogicalOperator
} from './decorators/is-required-if.decorator';
export type {
    ConditionFunction,
    IsRequiredIfOptions
} from './decorators/is-required-if.decorator';

// Environment-based validation decorator
export {
    EnvironmentHelpers, IsRequiredInEnv,
    IsRequiredInEnvConstraint
} from './decorators/is-required-in-env.decorator';

// Pre-built configuration schemas
export { EmailConfigSchema, EmailProvider } from './schemas/email-config.schema';
export { Environment, StorageConfigSchema, StorageProvider } from './schemas/storage-config.schema';

// Utility functions
export {
    EnvParser, convertEnvKeysToCamelCase, deepFreeze, extractEnvWithPrefix, formatValidationErrors, generateConfigToken,
    generateEnvPrefix, mergeConfigurations
} from './utils/config.utils';
export type {
    ValidationErrorDetail,
    ValidationResult
} from './utils/config.utils';

// Type definitions for better TypeScript support
export interface ConfigTokenMap {
  [featureName: string]: string;
}

/**
 * Helper type for extracting configuration type from schema
 */
export type ConfigType<T> = T extends new (...args: any[]) => infer R ? R : never;

/**
 * Helper type for creating strongly typed injection tokens
 */
export type FeatureToken<T extends string> = `FEATURE_CONFIG_${Uppercase<T>}`;

/**
 * Version information
 */
export const VERSION = '1.0.0';

/**
 * Library metadata
 */
export const LIBRARY_INFO = {
  name: '@eng-mmustafa/nestjs-feature-config',
  version: VERSION,
  description: 'Type-safe feature configuration management for NestJS',
  author: 'Mohammed Mustafa',
  license: 'MIT',
} as const;
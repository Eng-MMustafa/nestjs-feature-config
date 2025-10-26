/**
 * NestJS Feature Config - Simplified Edition
 * 
 * Ultra-simple, type-safe configuration management for NestJS
 */

// Core exports
export { FeatureConfigModule, ConfigToken } from './config.module';
export type { ConfigOptions } from './config.module';

// Validation decorators
export { IsRequiredIf, IsRequiredInEnv, When } from './validation';
export type { ConditionFn } from './validation';

// Version
export const VERSION = '2.0.0-simplified';

// Library info
export const LIBRARY_INFO = {
  name: '@eng-mmustafa/nestjs-feature-config',
  version: VERSION,
  description: 'Ultra-simple, type-safe configuration management for NestJS',
  author: 'Mohammed Mustafa',
  license: 'MIT',
} as const;
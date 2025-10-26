import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsRequiredIf } from '../decorators/is-required-if.decorator';
import { IsRequiredInEnv } from '../decorators/is-required-in-env.decorator';

/**
 * Application environment types
 */
export enum AppEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Feature Configuration Schema with Environment-Based Validation
 * 
 * This schema demonstrates the powerful @IsRequiredInEnv decorator
 * which ensures certain fields are required only in specific environments.
 * This solves the common problem of having different validation rules
 * for different deployment environments.
 */
export class FeatureConfigSchema {
  /**
   * Application environment
   */
  @IsEnum(AppEnvironment, {
    message: 'Environment must be one of: development, staging, production, test',
  })
  environment: AppEnvironment;

  /**
   * API Key - Required only in production environment
   * This demonstrates the main use case for @IsRequiredInEnv
   */
  @IsRequiredInEnv('production', 'NODE_ENV', {
    message: 'API Key is required when NODE_ENV is production',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  /**
   * Database URL - Required in production and staging
   * Shows how to use the decorator with custom environment variable
   */
  @IsRequiredInEnv('production', 'APP_ENV', {
    message: 'Database URL is required when APP_ENV is production',
  })
  @IsOptional()
  @IsString()
  databaseUrl?: string;

  /**
   * Secret Key - Required in production environment
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  secretKey?: string;

  /**
   * Debug Mode - Should be disabled in production
   * Demonstrates combining with regular IsRequiredIf
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  debugMode?: boolean = false;

  /**
   * Queue URL - Required when not in development
   * Demonstrates complex environment logic
   */
  @IsRequiredIf({
    condition: (obj) => obj.environment !== AppEnvironment.DEVELOPMENT,
    message: 'Queue URL is required in non-development environments',
  })
  @IsOptional()
  @IsString()
  queueUrl?: string;

  /**
   * Log Level - Different defaults for different environments
   */
  @IsOptional()
  @IsString()
  logLevel?: string = 'info';

  /**
   * SSL Certificate Path - Required in production for HTTPS
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  sslCertPath?: string;

  /**
   * SSL Private Key Path - Required in production for HTTPS
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  sslKeyPath?: string;

  /**
   * External Service API Key - Required in staging and production
   * Shows how to combine environment validation with complex logic
   */
  @IsRequiredIf({
    condition: (obj) => ['staging', 'production'].includes(obj.environment),
    message: 'External service API key is required in staging and production environments',
  })
  @IsOptional()
  @IsString()
  externalServiceApiKey?: string;

  /**
   * Monitoring Endpoint - Required in production
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  monitoringEndpoint?: string;

  /**
   * Feature Flags Service URL - Required when not in development
   */
  @IsRequiredIf({
    condition: (obj) => obj.environment !== AppEnvironment.DEVELOPMENT,
    message: 'Feature flags service URL is required in non-development environments',
  })
  @IsOptional()
  @IsString()
  featureFlagsUrl?: string;

  /**
   * Maximum connections - Higher limits required in production
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  maxConnections?: number = 10;

  /**
   * Cache TTL - Different values for different environments
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  cacheTtl?: number = 300; // 5 minutes default

  /**
   * Rate Limiting - Stricter in production
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  rateLimit?: number = 100;

  /**
   * CORS Origins - Stricter validation in production
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  corsOrigins?: string;

  /**
   * Session Secret - Required in production for security
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  sessionSecret?: string;

  /**
   * JWT Secret - Critical for production authentication
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  jwtSecret?: string;

  /**
   * Backup S3 Bucket - Required in production for data safety
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  backupS3Bucket?: string;

  /**
   * Error Reporting Service API Key - Required for production monitoring
   */
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  errorReportingApiKey?: string;
}
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsRequiredIf, IsRequiredInEnv, When } from '../validation';

/**
 * Simple configuration schema example
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging', 
  PRODUCTION = 'production',
}

export enum Provider {
  LOCAL = 'local',
  AWS = 'aws',
  AZURE = 'azure',
}

export class SimpleConfigSchema {
  @IsEnum(Environment)
  environment: Environment;

  @IsEnum(Provider)
  provider: Provider;

  // Required only in production
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  apiKey?: string;

  // Required when using AWS
  @IsRequiredIf(When.propertyEquals('provider', Provider.AWS))
  @IsOptional()
  @IsString()
  awsAccessKey?: string;

  // Required in production AND using AWS
  @IsRequiredIf(When.and(
    When.isProduction(),
    When.propertyEquals('provider', Provider.AWS)
  ))
  @IsOptional()
  @IsString()
  awsSecretKey?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  debugMode?: boolean = false;

  @IsOptional()
  @IsString()
  logLevel?: string = 'info';
}
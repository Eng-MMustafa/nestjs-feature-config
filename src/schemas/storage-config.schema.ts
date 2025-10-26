import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ConditionHelpers, IsRequiredIf } from '../decorators/is-required-if.decorator';

/**
 * Storage provider types
 */
export enum StorageProvider {
  LOCAL = 'local',
  S3 = 's3',
  AZURE = 'azure',
  GCS = 'gcs',
}

/**
 * Environment types
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * Storage Configuration Schema
 *
 * Example configuration schema for storage service settings
 * Demonstrates conditional validation based on storage provider
 */
export class StorageConfigSchema {
  /**
   * Storage provider type
   */
  @IsEnum(StorageProvider, {
    message: 'Provider must be one of: local, s3, azure, gcs',
  })
  provider: StorageProvider;

  /**
   * Environment the application is running in
   */
  @IsOptional()
  @IsEnum(Environment)
  environment?: Environment;

  /**
   * Base directory for file storage
   */
  @IsOptional()
  @IsString()
  baseDir?: string = '/uploads';

  /**
   * Maximum file size in bytes
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  maxFileSize?: number = 10485760; // 10MB default

  /**
   * AWS Access Key ID - Required for S3 provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'AWS Access Key ID is required when using S3 storage provider',
  })
  @IsOptional()
  @IsString()
  awsAccessKeyId?: string;

  /**
   * AWS Secret Access Key - Required for S3 provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'AWS Secret Access Key is required when using S3 storage provider',
  })
  @IsOptional()
  @IsString()
  awsSecretAccessKey?: string;

  /**
   * AWS S3 Bucket Name - Required for S3 provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'S3 bucket name is required when using S3 storage provider',
  })
  @IsOptional()
  @IsString()
  s3BucketName?: string;

  /**
   * AWS S3 Region - Required for S3 provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'S3 region is required when using S3 storage provider',
  })
  @IsOptional()
  @IsString()
  s3Region?: string;

  /**
   * Azure Storage Account Name - Required for Azure provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
    message: 'Azure Storage Account Name is required when using Azure storage provider',
  })
  @IsOptional()
  @IsString()
  azureAccountName?: string;

  /**
   * Azure Storage Account Key - Required for Azure provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
    message: 'Azure Storage Account Key is required when using Azure storage provider',
  })
  @IsOptional()
  @IsString()
  azureAccountKey?: string;

  /**
   * Azure Container Name - Required for Azure provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
    message: 'Azure container name is required when using Azure storage provider',
  })
  @IsOptional()
  @IsString()
  azureContainerName?: string;

  /**
   * Google Cloud Storage Bucket Name - Required for GCS provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.GCS),
    message: 'GCS bucket name is required when using Google Cloud Storage provider',
  })
  @IsOptional()
  @IsString()
  gcsBucketName?: string;

  /**
   * Google Cloud Storage Project ID - Required for GCS provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.GCS),
    message: 'GCS project ID is required when using Google Cloud Storage provider',
  })
  @IsOptional()
  @IsString()
  gcsProjectId?: string;

  /**
   * Google Cloud Storage Key File Path - Required for GCS provider in production
   */
  @IsRequiredIf({
    condition: ConditionHelpers.and(
      ConditionHelpers.propertyEquals('provider', StorageProvider.GCS),
      ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION),
    ),
    message: 'GCS key file path is required when using Google Cloud Storage in production',
  })
  @IsOptional()
  @IsString()
  gcsKeyFilePath?: string;

  /**
   * Enable file compression
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableCompression?: boolean = false;

  /**
   * Enable file encryption - Required in production for cloud providers
   */
  @IsRequiredIf({
    condition: ConditionHelpers.and(
      ConditionHelpers.propertyIn('provider', [StorageProvider.S3, StorageProvider.AZURE, StorageProvider.GCS]),
      ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION),
    ),
    message: 'File encryption must be enabled for cloud storage providers in production',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  enableEncryption?: boolean = false;

  /**
   * CDN URL for serving files - Optional but recommended for production
   */
  @IsOptional()
  @IsUrl()
  cdnUrl?: string;
}
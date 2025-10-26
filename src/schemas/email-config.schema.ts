import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ConditionHelpers, IsRequiredIf } from '../decorators/is-required-if.decorator';

/**
 * Email provider types
 */
export enum EmailProvider {
  SMTP = 'smtp',
  SENDGRID = 'sendgrid',
  MAILGUN = 'mailgun',
  SES = 'ses',
}

/**
 * Email Configuration Schema
 *
 * Example configuration schema for email service settings
 * Demonstrates complex conditional validation with multiple providers
 */
export class EmailConfigSchema {
  /**
   * Email provider type
   */
  @IsEnum(EmailProvider, {
    message: 'Provider must be one of: smtp, sendgrid, mailgun, ses',
  })
  provider: EmailProvider;

  /**
   * Default sender email address
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  fromEmail: string;

  /**
   * Default sender name
   */
  @IsString()
  fromName: string;

  /**
   * Enable email sending (useful for development)
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: any }) => value === 'true' || value === true)
  enabled?: boolean = true;

  /**
   * SMTP Host - Required for SMTP provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
    message: 'SMTP host is required when using SMTP provider',
  })
  @IsOptional()
  @IsString()
  smtpHost?: string;

  /**
   * SMTP Port - Required for SMTP provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
    message: 'SMTP port is required when using SMTP provider',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: any }) => Number.parseInt(value, 10))
  smtpPort?: number;

  /**
   * SMTP Username - Required for SMTP provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
    message: 'SMTP username is required when using SMTP provider',
  })
  @IsOptional()
  @IsString()
  smtpUsername?: string;

  /**
   * SMTP Password - Required for SMTP provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
    message: 'SMTP password is required when using SMTP provider',
  })
  @IsOptional()
  @IsString()
  smtpPassword?: string;

  /**
   * SMTP Secure connection
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: any }) => value === 'true' || value === true)
  smtpSecure?: boolean = true;

  /**
   * SendGrid API Key - Required for SendGrid provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SENDGRID),
    message: 'SendGrid API key is required when using SendGrid provider',
  })
  @IsOptional()
  @IsString()
  sendgridApiKey?: string;

  /**
   * Mailgun API Key - Required for Mailgun provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.MAILGUN),
    message: 'Mailgun API key is required when using Mailgun provider',
  })
  @IsOptional()
  @IsString()
  mailgunApiKey?: string;

  /**
   * Mailgun Domain - Required for Mailgun provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.MAILGUN),
    message: 'Mailgun domain is required when using Mailgun provider',
  })
  @IsOptional()
  @IsString()
  mailgunDomain?: string;

  /**
   * AWS SES Region - Required for SES provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
    message: 'AWS SES region is required when using SES provider',
  })
  @IsOptional()
  @IsString()
  sesRegion?: string;

  /**
   * AWS Access Key ID - Required for SES provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
    message: 'AWS Access Key ID is required when using SES provider',
  })
  @IsOptional()
  @IsString()
  awsAccessKeyId?: string;

  /**
   * AWS Secret Access Key - Required for SES provider
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
    message: 'AWS Secret Access Key is required when using SES provider',
  })
  @IsOptional()
  @IsString()
  awsSecretAccessKey?: string;

  /**
   * Maximum retry attempts for failed emails
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: any }) => Number.parseInt(value, 10))
  maxRetries?: number = 3;

  /**
   * Rate limit (emails per minute)
   */
  @IsOptional()
  @IsNumber()
  @Transform(({ value }: { value: any }) => Number.parseInt(value, 10))
  rateLimit?: number = 100;

  /**
   * Enable email templates
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: any }) => value === 'true' || value === true)
  enableTemplates?: boolean = true;

  /**
   * Template directory path - Required when templates are enabled
   */
  @IsRequiredIf({
    condition: ConditionHelpers.propertyIsTruthy('enableTemplates'),
    message: 'Template directory path is required when templates are enabled',
  })
  @IsOptional()
  @IsString()
  templatePath?: string;
}
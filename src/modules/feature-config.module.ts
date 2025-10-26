import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import {
    convertEnvKeysToCamelCase,
    deepFreeze,
    extractEnvWithPrefix,
    formatValidationErrors,
    generateConfigToken,
    generateEnvPrefix,
    ValidationErrorDetail,
} from '../utils/config.utils';

/**
 * Options for registering a feature configuration
 */
export interface FeatureConfigOptions<T = any> {
  /** Name of the feature (used for injection token generation) */
  featureName: string;
  /** Configuration schema class for validation */
  schema: Type<T>;
  /** Custom environment variable prefix (defaults to featureName) */
  envPrefix?: string;
  /** Whether to freeze the configuration object (prevents runtime modifications) */
  freeze?: boolean;
  /** Whether to ignore unknown environment variables */
  ignoreUnknownEnvVars?: boolean;
  /** Custom environment variables object (defaults to process.env) */
  env?: Record<string, string | undefined>;
}

/**
 * FeatureConfigModule - Dynamic module for type-safe feature configuration
 *
 * Provides type-safe configuration management with validation for NestJS applications.
 * Supports conditional validation using the IsRequiredIf decorator.
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     FeatureConfigModule.register({
 *       featureName: 'STORAGE',
 *       schema: StorageConfigSchema,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class FeatureConfigModule {
  /**
   * Registers a feature configuration with validation
   *
   * @param options - Configuration options
   * @returns Dynamic module with configuration provider
   */
  static register<T>(options: FeatureConfigOptions<T>): DynamicModule {
    const {
      featureName,
      schema,
      envPrefix = generateEnvPrefix(featureName),
      freeze = true,
      ignoreUnknownEnvVars = true,
      env = process.env,
    } = options;

    // Generate injection token
    const configToken = generateConfigToken(featureName);

    // Create configuration provider
    const configProvider: Provider = {
      provide: configToken,
      useFactory: () => {
        return this.createAndValidateConfig(schema, envPrefix, freeze, ignoreUnknownEnvVars, env);
      },
    };

    return {
      module: FeatureConfigModule,
      providers: [configProvider],
      exports: [configProvider],
      global: false,
    };
  }

  /**
   * Registers multiple feature configurations
   *
   * @param configs - Array of configuration options
   * @returns Dynamic module with all configuration providers
   */
  static registerMultiple(configs: FeatureConfigOptions[]): DynamicModule {
    const providers: Provider[] = configs.map(config => {
      const configToken = generateConfigToken(config.featureName);
      const {
        schema,
        envPrefix = generateEnvPrefix(config.featureName),
        freeze = true,
        ignoreUnknownEnvVars = true,
        env = process.env,
      } = config;

      return {
        provide: configToken,
        useFactory: () => {
          return this.createAndValidateConfig(schema, envPrefix, freeze, ignoreUnknownEnvVars, env);
        },
      };
    });

    return {
      module: FeatureConfigModule,
      providers,
      exports: providers,
      global: false,
    };
  }

  /**
   * Registers configuration asynchronously
   *
   * @param options - Async configuration options
   * @returns Dynamic module with async configuration provider
   */
  static registerAsync<T>(options: {
    featureName: string;
    schema: Type<T>;
    useFactory: (...args: any[]) => Promise<Record<string, any>> | Record<string, any>;
    inject?: any[];
    freeze?: boolean;
  }): DynamicModule {
    const { featureName, schema, useFactory, inject = [], freeze = true } = options;
    const configToken = generateConfigToken(featureName);

    const configProvider: Provider = {
      provide: configToken,
      useFactory: async (...args: any[]) => {
        const rawConfig = await useFactory(...args);
        return this.validateAndTransformConfig(schema, rawConfig, freeze);
      },
      inject,
    };

    return {
      module: FeatureConfigModule,
      providers: [configProvider],
      exports: [configProvider],
      global: false,
    };
  }

  /**
   * Creates and validates configuration from environment variables
   *
   * @private
   */
  private static createAndValidateConfig<T>(
    schema: Type<T>,
    envPrefix: string,
    freeze: boolean,
    ignoreUnknownEnvVars: boolean,
    env: Record<string, string | undefined>,
  ): T {
    // Extract environment variables with prefix
    const envVars = extractEnvWithPrefix(envPrefix, env);

    // Convert keys to camelCase
    const camelCaseConfig = convertEnvKeysToCamelCase(envVars);

    // Filter out undefined values if ignoreUnknownEnvVars is true
    const filteredConfig = ignoreUnknownEnvVars
      ? Object.fromEntries(Object.entries(camelCaseConfig).filter(([, value]) => value !== undefined))
      : camelCaseConfig;

    return this.validateAndTransformConfig(schema, filteredConfig, freeze);
  }

  /**
   * Validates and transforms configuration object
   *
   * @private
   */
  private static validateAndTransformConfig<T>(
    schema: Type<T>,
    rawConfig: Record<string, any>,
    freeze: boolean,
  ): T {
    // Transform plain object to class instance
    const configInstance = plainToInstance(schema, rawConfig, {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
    });

    // Validate the configuration
    const validationErrors = validateSync(configInstance as object, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    // If validation fails, throw detailed error
    if (validationErrors.length > 0) {
      const errorDetails = this.formatValidationErrors(validationErrors);
      const errorMessage = formatValidationErrors(errorDetails);
      
      throw new Error(`Configuration validation failed:\n${errorMessage}`);
    }

    // Freeze configuration if requested
    if (freeze) {
      return deepFreeze(configInstance);
    }

    return configInstance;
  }

  /**
   * Formats class-validator errors into our error format
   *
   * @private
   */
  private static formatValidationErrors(errors: ValidationError[]): ValidationErrorDetail[] {
    const errorDetails: ValidationErrorDetail[] = [];

    const processError = (error: ValidationError, parentPath = '') => {
      const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.constraints) {
        errorDetails.push({
          property: propertyPath,
          value: error.value,
          constraints: error.constraints,
        });
      }

      if (error.children && error.children.length > 0) {
        for (const childError of error.children) {
          processError(childError, propertyPath);
        }
      }
    };

    for (const error of errors) {
      processError(error);
    }

    return errorDetails;
  }
}

/**
 * Decorator for injecting feature configuration
 *
 * @param featureName - Name of the feature to inject
 * @returns Parameter decorator
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class StorageService {
 *   constructor(
 *     @InjectFeatureConfig('STORAGE') private config: StorageConfigSchema,
 *   ) {}
 * }
 * ```
 */
export function InjectFeatureConfig(featureName: string) {
  const token = generateConfigToken(featureName);
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    // This would normally use @Inject() from @nestjs/common
    // For demonstration, we'll show the concept
    const existingTokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const tokens = [...existingTokens];
    tokens[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', tokens, target);
  };
}
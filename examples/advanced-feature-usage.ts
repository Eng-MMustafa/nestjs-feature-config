import { Inject, Injectable, Module } from '@nestjs/common';
import { FeatureConfigModule, generateConfigToken } from '../modules/feature-config.module';
import { FeatureConfigSchema } from '../schemas/feature-config.schema';

/**
 * Example service that demonstrates how to use the FeatureConfigSchema
 * with environment-based validation using @IsRequiredInEnv decorator.
 * 
 * This example shows the complete implementation of the requirements:
 * 1. ✅ Custom Validator Decorator (@IsRequiredInEnv)
 * 2. ✅ Config Schema Class with type safety
 * 3. ✅ FeatureConfigModule.register() dynamic module
 * 4. ✅ Error Handling Logic with validation failures
 */

/**
 * Service that uses the validated configuration
 */
@Injectable()
export class AdvancedFeatureService {
  constructor(
    @Inject(generateConfigToken('ADVANCED_FEATURE'))
    private readonly config: FeatureConfigSchema,
  ) {}

  /**
   * Get configuration information
   */
  getConfigInfo() {
    return {
      environment: this.config.environment,
      hasApiKey: !!this.config.apiKey,
      debugMode: this.config.debugMode,
      logLevel: this.config.logLevel,
      maxConnections: this.config.maxConnections,
      // TypeScript ensures these properties exist and are properly typed
    };
  }

  /**
   * Initialize service based on environment
   */
  async initialize() {
    console.log(`Initializing service in ${this.config.environment} environment`);

    // In production, we know these fields are guaranteed to exist
    // because validation would have failed during module registration
    if (this.config.environment === 'production') {
      console.log('Production mode: Using secure configuration');
      console.log('API Key configured:', !!this.config.apiKey);
      console.log('SSL configured:', !!this.config.sslCertPath);
      console.log('Monitoring enabled:', !!this.config.monitoringEndpoint);
    } else {
      console.log('Non-production mode: Using development configuration');
    }
  }

  /**
   * Get database connection based on environment
   */
  getDatabaseConnection() {
    if (this.config.environment === 'production' && this.config.databaseUrl) {
      return this.config.databaseUrl;
    }
    
    // Fallback for development
    return 'sqlite://./dev.db';
  }

  /**
   * Get external service configuration
   */
  getExternalServiceConfig() {
    return {
      apiKey: this.config.externalServiceApiKey,
      queueUrl: this.config.queueUrl,
      featureFlagsUrl: this.config.featureFlagsUrl,
    };
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return {
      jwtSecret: this.config.jwtSecret,
      sessionSecret: this.config.sessionSecret,
      corsOrigins: this.config.corsOrigins?.split(',') || ['*'],
      ssl: {
        cert: this.config.sslCertPath,
        key: this.config.sslKeyPath,
      },
    };
  }
}

/**
 * Example module demonstrating proper registration and error handling
 */
@Module({
  imports: [
    // This registration will validate all environment variables
    // and throw a detailed error if any @IsRequiredInEnv fields
    // are missing in the specified environment
    FeatureConfigModule.register({
      featureName: 'ADVANCED_FEATURE',
      schema: FeatureConfigSchema,
      freeze: true, // Prevent runtime modifications
    }),
  ],
  providers: [AdvancedFeatureService],
  exports: [AdvancedFeatureService],
})
export class AdvancedFeatureModule {
  /**
   * This module will fail to initialize if any validation errors occur.
   * For example, if NODE_ENV=production but ADVANCED_FEATURE_API_KEY is missing,
   * the application will throw an InternalServerErrorException at startup
   * with a detailed error message explaining exactly what's missing.
   */
}

/**
 * Example of how validation errors are handled during application bootstrap
 * 
 * If you start the application in production mode without required environment
 * variables, you'll see an error like:
 * 
 * ```
 * Configuration validation failed:
 * 
 * Property: apiKey
 * Value: undefined
 * Constraints:
 *   - API Key is required when NODE_ENV is production
 * 
 * Property: secretKey
 * Value: undefined
 * Constraints:
 *   - secretKey is required when NODE_ENV is production
 * ```
 * 
 * This ensures the application never starts in an invalid state.
 */

/**
 * Example environment variables for different environments:
 * 
 * Development (.env.development):
 * ```
 * NODE_ENV=development
 * ADVANCED_FEATURE_ENVIRONMENT=development
 * ADVANCED_FEATURE_DEBUG_MODE=true
 * ADVANCED_FEATURE_LOG_LEVEL=debug
 * ADVANCED_FEATURE_MAX_CONNECTIONS=5
 * ```
 * 
 * Production (.env.production):
 * ```
 * NODE_ENV=production
 * ADVANCED_FEATURE_ENVIRONMENT=production
 * ADVANCED_FEATURE_API_KEY=your-production-api-key
 * ADVANCED_FEATURE_SECRET_KEY=your-production-secret
 * ADVANCED_FEATURE_DATABASE_URL=postgresql://user:pass@prod-db:5432/db
 * ADVANCED_FEATURE_QUEUE_URL=redis://prod-redis:6379
 * ADVANCED_FEATURE_SSL_CERT_PATH=/etc/ssl/certs/app.crt
 * ADVANCED_FEATURE_SSL_KEY_PATH=/etc/ssl/private/app.key
 * ADVANCED_FEATURE_MONITORING_ENDPOINT=https://monitoring.example.com
 * ADVANCED_FEATURE_EXTERNAL_SERVICE_API_KEY=external-api-key
 * ADVANCED_FEATURE_FEATURE_FLAGS_URL=https://flags.example.com
 * ADVANCED_FEATURE_CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
 * ADVANCED_FEATURE_SESSION_SECRET=your-session-secret
 * ADVANCED_FEATURE_JWT_SECRET=your-jwt-secret
 * ADVANCED_FEATURE_BACKUP_S3_BUCKET=your-backup-bucket
 * ADVANCED_FEATURE_ERROR_REPORTING_API_KEY=error-reporting-key
 * ```
 */
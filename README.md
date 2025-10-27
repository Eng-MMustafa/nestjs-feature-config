# NestJS Feature Config

[![npm version](https://badge.fury.io/js/nestjs-feature-config.svg)](https://badge.fury.io/js/nestjs-feature-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/nestjs-feature-config.svg)](https://www.npmjs.com/package/nestjs-feature-config)

A powerful NestJS Dynamic Module for **type-safe feature configuration management** with **conditional validation**. Build robust, scalable applications with validated configuration schemas that adapt to your deployment environment.

## 🚀 Features

- **🛡️ Type-Safe**: Full TypeScript support with strong typing
- **🔧 Conditional Validation**: Advanced validation with `@IsRequiredIf` decorator
- **🌟 Environment-Based Validation**: Revolutionary `@IsRequiredInEnv` decorator for environment-specific requirements
- **⚡ Dynamic Modules**: Easy registration and dependency injection
- **🌍 Environment-Aware**: Seamless environment variable integration
- **🎯 Feature-Based**: Organize configuration by features, not files
- **🧪 Testing-Friendly**: Built-in support for testing with custom environments
- **📦 Zero Dependencies**: No additional runtime dependencies beyond NestJS and class-validator
- **🔒 Immutable**: Optional configuration freezing for runtime safety
- **💥 Fail-Fast**: Application stops immediately on configuration errors

## 📦 Installation

### Using npm
```bash
npm install nestjs-feature-config class-validator class-transformer
```

### Using yarn
```bash
yarn add nestjs-feature-config class-validator class-transformer
```

### Using pnpm
```bash
pnpm add nestjs-feature-config class-validator class-transformer
```

## 🏃 Quick Start

### 1. Create a Configuration Schema

```typescript
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { IsRequiredIf, IsRequiredInEnv, ConditionHelpers } from 'nestjs-feature-config';

export enum StorageProvider {
  LOCAL = 'local',
  S3 = 's3',
  AZURE = 'azure',
}

export class StorageConfigSchema {
  @IsEnum(StorageProvider)
  provider: StorageProvider;

  @IsOptional()
  @IsString()
  baseDir?: string = '/uploads';

  // 🌟 REVOLUTIONARY: Required only in production environment
  @IsRequiredInEnv('production', 'NODE_ENV', {
    message: 'AWS Access Key is required in production environment',
  })
  @IsOptional()
  @IsString()
  awsAccessKeyId?: string;

  // Required only when using S3 provider
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'AWS Secret Key is required when using S3 provider',
  })
  @IsOptional()
  @IsString()
  awsSecretAccessKey?: string;

  // Required only when using S3 provider
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
    message: 'S3 bucket name is required when using S3 provider',
  })
  @IsOptional()
  @IsString()
  s3BucketName?: string;
}
```

### 2. Register the Configuration Module

```typescript
import { Module } from '@nestjs/common';
import { FeatureConfigModule } from 'nestjs-feature-config';
import { StorageConfigSchema } from './config/storage-config.schema';

@Module({
  imports: [
    FeatureConfigModule.register({
      featureName: 'STORAGE',
      schema: StorageConfigSchema,
    }),
  ],
})
export class AppModule {}
```

### 3. Inject and Use Configuration

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { generateConfigToken } from 'nestjs-feature-config';
import { StorageConfigSchema } from './config/storage-config.schema';

@Injectable()
export class StorageService {
  constructor(
    @Inject(generateConfigToken('STORAGE'))
    private readonly config: StorageConfigSchema,
  ) {}

  getStorageInfo() {
    return {
      provider: this.config.provider,
      baseDir: this.config.baseDir,
      isS3: this.config.provider === 's3',
      bucketName: this.config.s3BucketName,
    };
  }

  async uploadFile(file: Buffer, filename: string) {
    switch (this.config.provider) {
      case 'local':
        return this.uploadToLocal(file, filename);
      case 's3':
        return this.uploadToS3(file, filename);
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  private uploadToS3(file: Buffer, filename: string) {
    // Use this.config.awsAccessKeyId, this.config.s3BucketName, etc.
    // TypeScript knows these are available because validation passed
  }
}
```

### 4. Set Environment Variables

```bash
# For local storage
STORAGE_PROVIDER=local
STORAGE_BASE_DIR=/custom/uploads

# For S3 storage
STORAGE_PROVIDER=s3
STORAGE_AWS_ACCESS_KEY_ID=your-access-key
STORAGE_AWS_SECRET_ACCESS_KEY=your-secret-key
STORAGE_S3_BUCKET_NAME=my-app-bucket
```

## 🎯 Advanced Usage

### 🌟 Revolutionary Environment-Based Validation with @IsRequiredInEnv

The `@IsRequiredInEnv` decorator solves a critical problem in modern applications: **different validation requirements for different environments**. This decorator ensures fields are required only in specific environments, preventing configuration errors and improving developer experience.

```typescript
import { IsString, IsOptional } from 'class-validator';
import { IsRequiredInEnv } from 'nestjs-feature-config';

export class ApiConfigSchema {
  // 🔥 Revolutionary: API key required ONLY in production
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  apiKey?: string;

  // 🔥 Database URL required in production and staging
  @IsRequiredInEnv('staging')
  @IsRequiredInEnv('production')
  @IsOptional()
  @IsString()
  databaseUrl?: string;

  // 🔥 Custom environment variable name
  @IsRequiredInEnv('production', 'APP_ENV')
  @IsOptional()
  @IsString()
  secretKey?: string;

  // Debug mode (should be false in production)
  @IsOptional()
  @IsBoolean()
  debugMode?: boolean = false;
}
```

**Benefits:**
- ✅ **Development Freedom**: No API keys required in development
- ✅ **Production Safety**: Critical fields are enforced in production
- ✅ **Clear Error Messages**: Know exactly what's missing and why
- ✅ **Fail-Fast**: Application won't start with invalid configuration
- ✅ **Type Safety**: Full TypeScript support

**Environment Variables:**
```bash
# Development - minimal requirements
NODE_ENV=development

# Production - all critical fields required
NODE_ENV=production
API_API_KEY=your-production-api-key
API_DATABASE_URL=postgresql://prod-server/db
API_SECRET_KEY=your-secret-key
```

### Conditional Validation with Multiple Conditions

```typescript
export class EmailConfigSchema {
  @IsEnum(EmailProvider)
  provider: EmailProvider;

  @IsEnum(Environment)
  environment: Environment;

  // Required in production for cloud providers
  @IsRequiredIf({
    condition: [
      ConditionHelpers.propertyIn('provider', ['sendgrid', 'mailgun']),
      ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION),
    ],
    operator: LogicalOperator.AND,
    message: 'API key is required for cloud email providers in production',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  // Required when encryption is enabled OR in production
  @IsRequiredIf({
    condition: [
      ConditionHelpers.propertyIsTruthy('enableEncryption'),
      ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION),
    ],
    operator: LogicalOperator.OR,
    message: 'Certificate path required when encryption is enabled or in production',
  })
  @IsOptional()
  @IsString()
  certificatePath?: string;
}
```

### Custom Condition Functions

```typescript
export class DatabaseConfigSchema {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  // Custom condition: SSL required for external hosts
  @IsRequiredIf({
    condition: (obj) => !obj.host.includes('localhost') && !obj.host.includes('127.0.0.1'),
    message: 'SSL configuration is required for external database hosts',
  })
  @IsOptional()
  @IsBoolean()
  ssl?: boolean;

  // Complex condition: connection pooling required for high-traffic environments
  @IsRequiredIf({
    condition: (obj) => {
      const isProduction = obj.environment === 'production';
      const hasHighTraffic = obj.expectedConnections > 100;
      return isProduction || hasHighTraffic;
    },
    message: 'Connection pooling is required for production or high-traffic scenarios',
  })
  @IsOptional()
  @IsObject()
  pooling?: DatabasePoolConfig;
}
```

### Multiple Feature Configurations

```typescript
@Module({
  imports: [
    FeatureConfigModule.registerMultiple([
      {
        featureName: 'STORAGE',
        schema: StorageConfigSchema,
      },
      {
        featureName: 'EMAIL',
        schema: EmailConfigSchema,
      },
      {
        featureName: 'DATABASE',
        schema: DatabaseConfigSchema,
      },
    ]),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
@Module({
  imports: [
    FeatureConfigModule.registerAsync({
      featureName: 'STORAGE',
      schema: StorageConfigSchema,
      useFactory: async (configService: ConfigService) => {
        // Load configuration from external source
        const externalConfig = await configService.getExternalConfig();
        return {
          provider: externalConfig.storageProvider,
          awsAccessKeyId: externalConfig.aws.accessKeyId,
          // ... other config
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Configuration in Services

```typescript
@Injectable()
export class EmailService {
  constructor(
    @Inject(generateConfigToken('EMAIL'))
    private readonly emailConfig: EmailConfigSchema,
    
    @Inject(generateConfigToken('STORAGE'))
    private readonly storageConfig: StorageConfigSchema,
  ) {}

  async sendEmailWithAttachment(to: string, subject: string, attachment: string) {
    // Access email configuration
    const emailProvider = this.emailConfig.provider;
    
    // Access storage configuration for attachment handling
    const storageProvider = this.storageConfig.provider;
    
    // TypeScript ensures all required properties are available
    if (emailProvider === 'sendgrid') {
      const apiKey = this.emailConfig.sendgridApiKey; // TypeScript knows this exists
      // Send via SendGrid
    }
  }
}
```

## 🧪 Testing

### Testing with Custom Environment

```typescript
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const mockEnv = {
      STORAGE_PROVIDER: 's3',
      STORAGE_AWS_ACCESS_KEY_ID: 'test-key',
      STORAGE_AWS_SECRET_ACCESS_KEY: 'test-secret',
      STORAGE_S3_BUCKET_NAME: 'test-bucket',
    };

    const module = await Test.createTestingModule({
      imports: [
        FeatureConfigModule.register({
          featureName: 'STORAGE',
          schema: StorageConfigSchema,
          env: mockEnv, // Use custom environment for testing
        }),
      ],
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should configure S3 storage correctly', () => {
    const info = service.getStorageInfo();
    expect(info.provider).toBe('s3');
    expect(info.isS3).toBe(true);
    expect(info.bucketName).toBe('test-bucket');
  });
});
```

### Testing Validation Errors

```typescript
it('should throw validation error for missing S3 configuration', async () => {
  const invalidEnv = {
    STORAGE_PROVIDER: 's3',
    // Missing required S3 fields
  };

  await expect(
    Test.createTestingModule({
      imports: [
        FeatureConfigModule.register({
          featureName: 'STORAGE',
          schema: StorageConfigSchema,
          env: invalidEnv,
        }),
      ],
    }).compile(),
  ).rejects.toThrow('AWS Access Key is required when using S3 provider');
});
```

## 🔧 API Reference

### `@IsRequiredInEnv(env, envVar?, options?)`

🌟 **Revolutionary decorator for environment-based validation**

Validates that a field is required only when the application is running in a specific environment. This solves the critical problem of having different validation requirements across development, staging, and production environments.

**Parameters:**
- `env`: The environment in which this field is required (e.g., 'production', 'staging')
- `envVar`: Environment variable to check (default: 'NODE_ENV')
- `options`: Standard class-validator ValidationOptions

**Examples:**
```typescript
// Required only in production
@IsRequiredInEnv('production')
apiKey?: string;

// Required in production, check APP_ENV instead of NODE_ENV
@IsRequiredInEnv('production', 'APP_ENV')
databaseUrl?: string;

// Required in staging with custom message
@IsRequiredInEnv('staging', 'NODE_ENV', {
  message: 'Staging API key is required for testing external integrations',
})
stagingApiKey?: string;
```

### `@IsRequiredIf(options)`

Custom validation decorator for conditional field requirements.

**Options:**
- `condition`: Single function or array of condition functions
- `operator`: `LogicalOperator.AND` or `LogicalOperator.OR` (default: AND)
- `message`: Custom error message

**Example:**
```typescript
@IsRequiredIf({
  condition: ConditionHelpers.propertyEquals('provider', 'aws'),
  message: 'AWS credentials required when using AWS provider',
})
apiKey?: string;
```

### `ConditionHelpers`

Pre-built condition functions for common scenarios:

- `propertyEquals(prop, value)`: Check if property equals value
- `propertyIn(prop, values)`: Check if property is in array
- `propertyIsTruthy(prop)`: Check if property is truthy
- `propertyExists(prop)`: Check if property exists
- `and(...conditions)`: Combine conditions with AND
- `or(...conditions)`: Combine conditions with OR
- `not(condition)`: Negate a condition

### `FeatureConfigModule.register(options)`

Register a single feature configuration.

**Options:**
- `featureName`: Name of the feature
- `schema`: Configuration schema class
- `envPrefix`: Custom environment variable prefix
- `freeze`: Whether to freeze configuration object
- `env`: Custom environment variables object

### Environment Variable Mapping

Environment variables are automatically mapped to schema properties:

```
STORAGE_PROVIDER → provider
STORAGE_AWS_ACCESS_KEY_ID → awsAccessKeyId
STORAGE_S3_BUCKET_NAME → s3BucketName
```

## 📝 Best Practices

### 1. Organize by Features

```typescript
// ✅ Good: Feature-based configuration
@Module({
  imports: [
    FeatureConfigModule.register({ featureName: 'STORAGE', schema: StorageConfigSchema }),
    FeatureConfigModule.register({ featureName: 'EMAIL', schema: EmailConfigSchema }),
    FeatureConfigModule.register({ featureName: 'AUTH', schema: AuthConfigSchema }),
  ],
})
export class AppModule {}
```

### 2. Use Descriptive Validation Messages

```typescript
// ✅ Good: Clear, actionable error messages
@IsRequiredIf({
  condition: ConditionHelpers.propertyEquals('provider', 'aws'),
  message: 'AWS Access Key ID is required when using AWS provider. Set STORAGE_AWS_ACCESS_KEY_ID environment variable.',
})
awsAccessKeyId?: string;
```

### 3. Provide Sensible Defaults

```typescript
// ✅ Good: Sensible defaults for optional fields
@IsOptional()
@IsNumber()
@Transform(({ value }) => parseInt(value, 10))
maxFileSize?: number = 10485760; // 10MB default
```

### 4. Group Related Configurations

```typescript
// ✅ Good: Group related settings
export class RedisConfigSchema {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  // Group connection settings
  @IsOptional()
  @IsObject()
  connection?: {
    connectTimeout?: number;
    lazyConnect?: boolean;
    retryDelayOnFailover?: number;
  };
}
```

## 🛠️ Configuration Examples

### Complete Storage Configuration

```typescript
export class StorageConfigSchema {
  @IsEnum(StorageProvider)
  provider: StorageProvider;

  @IsOptional()
  @IsString()
  baseDir?: string = '/uploads';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  maxFileSize?: number = 10485760;

  // AWS S3 Configuration
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
  })
  @IsOptional()
  @IsString()
  awsAccessKeyId?: string;

  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
  })
  @IsOptional()
  @IsString()
  awsSecretAccessKey?: string;

  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
  })
  @IsOptional()
  @IsString()
  s3BucketName?: string;

  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
  })
  @IsOptional()
  @IsString()
  s3Region?: string;

  // Azure Blob Configuration
  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
  })
  @IsOptional()
  @IsString()
  azureAccountName?: string;

  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
  })
  @IsOptional()
  @IsString()
  azureAccountKey?: string;

  @IsRequiredIf({
    condition: ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
  })
  @IsOptional()
  @IsString()
  azureContainerName?: string;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer)
- Inspired by NestJS's configuration best practices
- Thanks to the NestJS community for feedback and suggestions

## 🔗 Links

- [GitHub Repository](https://github.com/Eng-MMustafa/nestjs-feature-config)
- [npm Package](https://www.npmjs.com/package/nestjs-feature-config)
- [Issues](https://github.com/Eng-MMustafa/nestjs-feature-config/issues)

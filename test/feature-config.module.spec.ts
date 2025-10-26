import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureConfigModule, InjectFeatureConfig } from '../src/modules/feature-config.module';
import { StorageConfigSchema, StorageProvider } from '../src/schemas/storage-config.schema';
import { generateConfigToken } from '../src/utils/config.utils';

/**
 * Test service that uses injected configuration
 */
@Injectable()
class TestStorageService {
  constructor(
    @InjectFeatureConfig('STORAGE') private config: StorageConfigSchema,
  ) {}

  getProvider(): StorageProvider {
    return this.config.provider;
  }

  getConfig(): StorageConfigSchema {
    return this.config;
  }
}

describe('FeatureConfigModule', () => {
  let module: TestingModule;
  let storageService: TestStorageService;

  describe('with valid S3 configuration', () => {
    beforeAll(async () => {
      // Mock environment variables for S3 configuration
      const mockEnv = {
        STORAGE_PROVIDER: 's3',
        STORAGE_AWS_ACCESS_KEY_ID: 'test-key',
        STORAGE_AWS_SECRET_ACCESS_KEY: 'test-secret',
        STORAGE_S3_BUCKET_NAME: 'test-bucket',
        STORAGE_S3_REGION: 'us-east-1',
        STORAGE_ENABLE_COMPRESSION: 'true',
      };

      module = await Test.createTestingModule({
        imports: [
          FeatureConfigModule.register({
            featureName: 'STORAGE',
            schema: StorageConfigSchema,
            env: mockEnv,
          }),
        ],
        providers: [TestStorageService],
      }).compile();

      storageService = module.get<TestStorageService>(TestStorageService);
    });

    afterAll(async () => {
      await module.close();
    });

    it('should be defined', () => {
      expect(storageService).toBeDefined();
    });

    it('should inject valid configuration', () => {
      const config = storageService.getConfig();
      expect(config.provider).toBe(StorageProvider.S3);
      expect(config.awsAccessKeyId).toBe('test-key');
      expect(config.awsSecretAccessKey).toBe('test-secret');
      expect(config.s3BucketName).toBe('test-bucket');
      expect(config.s3Region).toBe('us-east-1');
      expect(config.enableCompression).toBe(true);
    });

    it('should have correct provider', () => {
      expect(storageService.getProvider()).toBe(StorageProvider.S3);
    });
  });

  describe('with invalid configuration', () => {
    it('should throw validation error for missing required S3 fields', async () => {
      const mockEnv = {
        STORAGE_PROVIDER: 's3',
        // Missing required S3 fields
      };

      await expect(
        Test.createTestingModule({
          imports: [
            FeatureConfigModule.register({
              featureName: 'STORAGE',
              schema: StorageConfigSchema,
              env: mockEnv,
            }),
          ],
        }).compile(),
      ).rejects.toThrow(/Configuration validation failed/);
    });

    it('should throw validation error for invalid provider', async () => {
      const mockEnv = {
        STORAGE_PROVIDER: 'invalid-provider',
      };

      await expect(
        Test.createTestingModule({
          imports: [
            FeatureConfigModule.register({
              featureName: 'STORAGE',
              schema: StorageConfigSchema,
              env: mockEnv,
            }),
          ],
        }).compile(),
      ).rejects.toThrow(/Provider must be one of/);
    });
  });

  describe('with local storage configuration', () => {
    beforeAll(async () => {
      const mockEnv = {
        STORAGE_PROVIDER: 'local',
        STORAGE_BASE_DIR: '/custom/uploads',
        STORAGE_MAX_FILE_SIZE: '52428800', // 50MB
      };

      module = await Test.createTestingModule({
        imports: [
          FeatureConfigModule.register({
            featureName: 'STORAGE',
            schema: StorageConfigSchema,
            env: mockEnv,
          }),
        ],
        providers: [TestStorageService],
      }).compile();

      storageService = module.get<TestStorageService>(TestStorageService);
    });

    afterAll(async () => {
      await module.close();
    });

    it('should work with local provider without cloud-specific fields', () => {
      const config = storageService.getConfig();
      expect(config.provider).toBe(StorageProvider.LOCAL);
      expect(config.baseDir).toBe('/custom/uploads');
      expect(config.maxFileSize).toBe(52428800);
      expect(config.awsAccessKeyId).toBeUndefined();
    });
  });

  describe('registerMultiple', () => {
    it('should register multiple configurations', async () => {
      const storageEnv = {
        STORAGE_PROVIDER: 'local',
      };

      const emailEnv = {
        EMAIL_PROVIDER: 'smtp',
        EMAIL_FROM_EMAIL: 'test@example.com',
        EMAIL_FROM_NAME: 'Test Sender',
        EMAIL_SMTP_HOST: 'smtp.example.com',
        EMAIL_SMTP_PORT: '587',
        EMAIL_SMTP_USERNAME: 'user',
        EMAIL_SMTP_PASSWORD: 'pass',
      };

      const mergedEnv = { ...storageEnv, ...emailEnv };

      module = await Test.createTestingModule({
        imports: [
          FeatureConfigModule.registerMultiple([
            {
              featureName: 'STORAGE',
              schema: StorageConfigSchema,
              env: mergedEnv,
            },
            {
              featureName: 'EMAIL',
              schema: require('../src/schemas/email-config.schema').EmailConfigSchema,
              env: mergedEnv,
            },
          ]),
        ],
      }).compile();

      const storageToken = generateConfigToken('STORAGE');
      const emailToken = generateConfigToken('EMAIL');

      const storageConfig = module.get(storageToken);
      const emailConfig = module.get(emailToken);

      expect(storageConfig).toBeDefined();
      expect(emailConfig).toBeDefined();
      expect(storageConfig.provider).toBe('local');
      expect(emailConfig.provider).toBe('smtp');
    });
  });

  describe('configuration freezing', () => {
    beforeAll(async () => {
      const mockEnv = {
        STORAGE_PROVIDER: 'local',
      };

      module = await Test.createTestingModule({
        imports: [
          FeatureConfigModule.register({
            featureName: 'STORAGE',
            schema: StorageConfigSchema,
            env: mockEnv,
            freeze: true,
          }),
        ],
        providers: [TestStorageService],
      }).compile();

      storageService = module.get<TestStorageService>(TestStorageService);
    });

    afterAll(async () => {
      await module.close();
    });

    it('should freeze configuration object', () => {
      const config = storageService.getConfig();
      expect(Object.isFrozen(config)).toBe(true);
      
      // Attempting to modify should fail silently in non-strict mode
      // or throw in strict mode
      expect(() => {
        (config as any).provider = 's3';
      }).not.toThrow(); // In non-strict mode
      
      // Value should remain unchanged
      expect(config.provider).toBe(StorageProvider.LOCAL);
    });
  });
});
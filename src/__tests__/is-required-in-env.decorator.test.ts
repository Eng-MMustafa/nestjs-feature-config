import { ValidationArguments } from 'class-validator';
import { IsRequiredInEnvConstraint } from '../src/decorators/is-required-in-env.decorator';

/**
 * Test suite for @IsRequiredInEnv decorator
 * 
 * This test file validates that the @IsRequiredInEnv decorator works correctly
 * for environment-based conditional validation, which solves the core problem
 * mentioned in the requirements.
 */
describe('IsRequiredInEnv Decorator', () => {
  let constraint: IsRequiredInEnvConstraint;
  let originalEnv: string | undefined;

  beforeEach(() => {
    constraint = new IsRequiredInEnvConstraint();
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore original environment
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  describe('Production Environment Requirements', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should require field when in production environment', () => {
      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(false);
    });

    it('should pass validation when field has value in production', () => {
      const args: ValidationArguments = {
        value: 'prod-api-key',
        property: 'apiKey',
        object: { apiKey: 'prod-api-key' },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate('prod-api-key', args);
      expect(result).toBe(true);
    });

    it('should fail validation for empty string in production', () => {
      const args: ValidationArguments = {
        value: '',
        property: 'apiKey',
        object: { apiKey: '' },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate('', args);
      expect(result).toBe(false);
    });

    it('should fail validation for null value in production', () => {
      const args: ValidationArguments = {
        value: null,
        property: 'apiKey',
        object: { apiKey: null },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(null, args);
      expect(result).toBe(false);
    });
  });

  describe('Development Environment Requirements', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should NOT require field when in development environment', () => {
      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['production'], // Field required only in production
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(true); // Should pass because we're in development
    });

    it('should allow empty values in development', () => {
      const args: ValidationArguments = {
        value: '',
        property: 'apiKey',
        object: { apiKey: '' },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate('', args);
      expect(result).toBe(true);
    });
  });

  describe('Custom Environment Variable', () => {
    beforeEach(() => {
      process.env.APP_ENV = 'production';
      process.env.NODE_ENV = 'development'; // Different from APP_ENV
    });

    afterEach(() => {
      delete process.env.APP_ENV;
    });

    it('should use custom environment variable when specified', () => {
      const args: ValidationArguments = {
        value: undefined,
        property: 'databaseUrl',
        object: { databaseUrl: undefined },
        constraints: ['production', 'APP_ENV'], // Check APP_ENV instead of NODE_ENV
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(false); // Should fail because APP_ENV is production
    });

    it('should pass when custom env var does not match required env', () => {
      process.env.APP_ENV = 'staging';

      const args: ValidationArguments = {
        value: undefined,
        property: 'databaseUrl',
        object: { databaseUrl: undefined },
        constraints: ['production', 'APP_ENV'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(true); // Should pass because APP_ENV is staging, not production
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should provide default error message', () => {
      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const message = constraint.defaultMessage(args);
      expect(message).toBe('apiKey is required when NODE_ENV is \'production\'');
    });

    it('should provide custom error message when using custom env var', () => {
      const args: ValidationArguments = {
        value: undefined,
        property: 'secretKey',
        object: { secretKey: undefined },
        constraints: ['production', 'APP_ENV'],
        targetName: 'TestConfig',
      };

      const message = constraint.defaultMessage(args);
      expect(message).toBe('secretKey is required when APP_ENV is \'production\'');
    });
  });

  describe('Multiple Environment Scenarios', () => {
    it('should handle staging environment correctly', () => {
      process.env.NODE_ENV = 'staging';

      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['staging'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(false); // Should fail because we're in staging and field is required
    });

    it('should handle test environment correctly', () => {
      process.env.NODE_ENV = 'test';

      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['production'], // Only required in production
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(true); // Should pass because we're in test, not production
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined environment variable', () => {
      delete process.env.NODE_ENV;

      const args: ValidationArguments = {
        value: undefined,
        property: 'apiKey',
        object: { apiKey: undefined },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(undefined, args);
      expect(result).toBe(true); // Should pass because env is not production
    });

    it('should handle boolean values correctly', () => {
      process.env.NODE_ENV = 'production';

      const args: ValidationArguments = {
        value: false,
        property: 'enableFeature',
        object: { enableFeature: false },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(false, args);
      expect(result).toBe(true); // Boolean false is a valid value
    });

    it('should handle number values correctly', () => {
      process.env.NODE_ENV = 'production';

      const args: ValidationArguments = {
        value: 0,
        property: 'maxConnections',
        object: { maxConnections: 0 },
        constraints: ['production'],
        targetName: 'TestConfig',
      };

      const result = constraint.validate(0, args);
      expect(result).toBe(true); // Number 0 is a valid value
    });
  });
});

/**
 * Integration test for the complete @IsRequiredInEnv decorator functionality
 * This demonstrates the real-world usage solving the problem mentioned in requirements
 */
describe('IsRequiredInEnv Integration Test', () => {
  it('should demonstrate the complete solution for environment-based validation', () => {
    // This test demonstrates how the @IsRequiredInEnv decorator solves the
    // core problem: ensuring API keys and other sensitive configurations
    // are required only in production environments, while allowing
    // development to proceed without them.

    const constraint = new IsRequiredInEnvConstraint();

    // Scenario 1: Development environment - API key not required
    process.env.NODE_ENV = 'development';
    const devArgs: ValidationArguments = {
      value: undefined,
      property: 'apiKey',
      object: { apiKey: undefined },
      constraints: ['production'],
      targetName: 'ApiConfig',
    };
    
    expect(constraint.validate(undefined, devArgs)).toBe(true);
    
    // Scenario 2: Production environment - API key required
    process.env.NODE_ENV = 'production';
    const prodArgs: ValidationArguments = {
      value: undefined,
      property: 'apiKey',
      object: { apiKey: undefined },
      constraints: ['production'],
      targetName: 'ApiConfig',
    };
    
    expect(constraint.validate(undefined, prodArgs)).toBe(false);
    
    // Scenario 3: Production environment with API key - should pass
    const prodWithKeyArgs: ValidationArguments = {
      value: 'prod-api-key-123',
      property: 'apiKey',
      object: { apiKey: 'prod-api-key-123' },
      constraints: ['production'],
      targetName: 'ApiConfig',
    };
    
    expect(constraint.validate('prod-api-key-123', prodWithKeyArgs)).toBe(true);
  });
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_required_in_env_decorator_1 = require("../decorators/is-required-in-env.decorator");
describe('IsRequiredInEnv Decorator', () => {
    let constraint;
    let originalEnv;
    beforeEach(() => {
        constraint = new is_required_in_env_decorator_1.IsRequiredInEnvConstraint();
        originalEnv = process.env.NODE_ENV;
    });
    afterEach(() => {
        if (originalEnv !== undefined) {
            process.env.NODE_ENV = originalEnv;
        }
        else {
            delete process.env.NODE_ENV;
        }
    });
    describe('Production Environment Requirements', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
        });
        it('should require field when in production environment', () => {
            const args = {
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
            const args = {
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
            const args = {
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
            const args = {
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
            const args = {
                value: undefined,
                property: 'apiKey',
                object: { apiKey: undefined },
                constraints: ['production'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(true);
        });
        it('should allow empty values in development', () => {
            const args = {
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
            process.env.NODE_ENV = 'development';
        });
        afterEach(() => {
            delete process.env.APP_ENV;
        });
        it('should use custom environment variable when specified', () => {
            const args = {
                value: undefined,
                property: 'databaseUrl',
                object: { databaseUrl: undefined },
                constraints: ['production', 'APP_ENV'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(false);
        });
        it('should pass when custom env var does not match required env', () => {
            process.env.APP_ENV = 'staging';
            const args = {
                value: undefined,
                property: 'databaseUrl',
                object: { databaseUrl: undefined },
                constraints: ['production', 'APP_ENV'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(true);
        });
    });
    describe('Error Messages', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
        });
        it('should provide default error message', () => {
            const args = {
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
            const args = {
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
            const args = {
                value: undefined,
                property: 'apiKey',
                object: { apiKey: undefined },
                constraints: ['staging'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(false);
        });
        it('should handle test environment correctly', () => {
            process.env.NODE_ENV = 'test';
            const args = {
                value: undefined,
                property: 'apiKey',
                object: { apiKey: undefined },
                constraints: ['production'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(true);
        });
    });
    describe('Edge Cases', () => {
        it('should handle undefined environment variable', () => {
            delete process.env.NODE_ENV;
            const args = {
                value: undefined,
                property: 'apiKey',
                object: { apiKey: undefined },
                constraints: ['production'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(undefined, args);
            expect(result).toBe(true);
        });
        it('should handle boolean values correctly', () => {
            process.env.NODE_ENV = 'production';
            const args = {
                value: false,
                property: 'enableFeature',
                object: { enableFeature: false },
                constraints: ['production'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(false, args);
            expect(result).toBe(true);
        });
        it('should handle number values correctly', () => {
            process.env.NODE_ENV = 'production';
            const args = {
                value: 0,
                property: 'maxConnections',
                object: { maxConnections: 0 },
                constraints: ['production'],
                targetName: 'TestConfig',
            };
            const result = constraint.validate(0, args);
            expect(result).toBe(true);
        });
    });
});
describe('IsRequiredInEnv Integration Test', () => {
    it('should demonstrate the complete solution for environment-based validation', () => {
        const constraint = new is_required_in_env_decorator_1.IsRequiredInEnvConstraint();
        process.env.NODE_ENV = 'development';
        const devArgs = {
            value: undefined,
            property: 'apiKey',
            object: { apiKey: undefined },
            constraints: ['production'],
            targetName: 'ApiConfig',
        };
        expect(constraint.validate(undefined, devArgs)).toBe(true);
        process.env.NODE_ENV = 'production';
        const prodArgs = {
            value: undefined,
            property: 'apiKey',
            object: { apiKey: undefined },
            constraints: ['production'],
            targetName: 'ApiConfig',
        };
        expect(constraint.validate(undefined, prodArgs)).toBe(false);
        const prodWithKeyArgs = {
            value: 'prod-api-key-123',
            property: 'apiKey',
            object: { apiKey: 'prod-api-key-123' },
            constraints: ['production'],
            targetName: 'ApiConfig',
        };
        expect(constraint.validate('prod-api-key-123', prodWithKeyArgs)).toBe(true);
    });
});

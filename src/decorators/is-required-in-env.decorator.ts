import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator constraint for IsRequiredInEnv decorator
 * 
 * This decorator validates that a property is required only when the application
 * is running in a specific environment (e.g., 'production', 'staging', 'development')
 */
@ValidatorConstraint({ name: 'isRequiredInEnv', async: false })
export class IsRequiredInEnvConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the property is required based on the current environment
   *
   * @param value - The value of the property being validated
   * @param args - Validation arguments containing constraints and object
   * @returns True if validation passes, false otherwise
   */
  validate(value: any, args: ValidationArguments): boolean {
    const [requiredEnv, envVariableName = 'NODE_ENV'] = args.constraints;
    const currentEnv = process.env[envVariableName];

    // If we're in the required environment, the field must not be empty
    if (currentEnv === requiredEnv) {
      return this.isNotEmpty(value);
    }

    // If we're not in the required environment, field is optional
    return true;
  }

  /**
   * Default error message for validation failure
   *
   * @param args - Validation arguments
   * @returns Error message string
   */
  defaultMessage(args: ValidationArguments): string {
    const [requiredEnv, envVariableName = 'NODE_ENV'] = args.constraints;
    return `${args.property} is required when ${envVariableName} is '${requiredEnv}'`;
  }

  /**
   * Checks if value is not empty (not null, undefined, or empty string)
   *
   * @param value - Value to check
   * @returns True if value is not empty
   */
  private isNotEmpty(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}

/**
 * IsRequiredInEnv decorator for environment-based conditional validation
 *
 * Validates that a field is required only when the application is running
 * in a specific environment. This is particularly useful for API keys,
 * database credentials, and other sensitive configuration that might
 * not be required in development but is essential in production.
 *
 * @example
 * ```typescript
 * class ApiConfig {
 *   @IsRequiredInEnv('production')
 *   @IsOptional()
 *   @IsString()
 *   apiKey?: string;
 *
 *   @IsRequiredInEnv('production', 'APP_ENV')
 *   @IsOptional()
 *   @IsString()
 *   secretKey?: string;
 * }
 * ```
 *
 * @param env - The environment in which this field is required
 * @param envVariableName - The environment variable to check (defaults to 'NODE_ENV')
 * @param validationOptions - Standard class-validator options
 * @returns Property decorator function
 */
export function IsRequiredInEnv(
  env: string,
  envVariableName: string = 'NODE_ENV',
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [env, envVariableName],
      validator: IsRequiredInEnvConstraint,
    });
  };
}

/**
 * Helper functions for common environment-based conditions
 */
export const EnvironmentHelpers = {
  /**
   * Creates a condition function for production environment
   * @returns Condition function that checks if NODE_ENV is 'production'
   */
  isProduction: () => process.env.NODE_ENV === 'production',

  /**
   * Creates a condition function for development environment
   * @returns Condition function that checks if NODE_ENV is 'development'
   */
  isDevelopment: () => process.env.NODE_ENV === 'development',

  /**
   * Creates a condition function for staging environment
   * @returns Condition function that checks if NODE_ENV is 'staging'
   */
  isStaging: () => process.env.NODE_ENV === 'staging',

  /**
   * Creates a condition function for test environment
   * @returns Condition function that checks if NODE_ENV is 'test'
   */
  isTest: () => process.env.NODE_ENV === 'test',

  /**
   * Creates a condition function for any specific environment
   * @param env - Environment to check for
   * @param envVar - Environment variable to check (defaults to NODE_ENV)
   * @returns Condition function
   */
  isEnvironment: (env: string, envVar: string = 'NODE_ENV') => 
    process.env[envVar] === env,

  /**
   * Creates a condition function for multiple environments
   * @param envs - Array of environments to check for
   * @param envVar - Environment variable to check (defaults to NODE_ENV)
   * @returns Condition function
   */
  isAnyEnvironment: (envs: string[], envVar: string = 'NODE_ENV') =>
    envs.includes(process.env[envVar] || ''),

  /**
   * Creates a condition function for non-development environments
   * @returns Condition function that checks if NODE_ENV is not 'development'
   */
  isNotDevelopment: () => process.env.NODE_ENV !== 'development',

  /**
   * Creates a condition function for production-like environments
   * @returns Condition function that checks if NODE_ENV is 'production' or 'staging'
   */
  isProductionLike: () => ['production', 'staging'].includes(process.env.NODE_ENV || ''),
};
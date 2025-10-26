import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Condition function type for IsRequiredIf decorator
 */
export type ConditionFunction = (object: any) => boolean;

/**
 * Logical operator for multiple conditions
 */
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

/**
 * Configuration options for IsRequiredIf decorator
 */
export interface IsRequiredIfOptions {
  /** Single condition function or array of conditions */
  condition: ConditionFunction | ConditionFunction[];
  /** Logical operator when multiple conditions are provided (default: AND) */
  operator?: LogicalOperator;
  /** Custom error message */
  message?: string;
}

/**
 * Validator constraint for IsRequiredIf decorator
 */
@ValidatorConstraint({ name: 'isRequiredIf', async: false })
export class IsRequiredIfConstraint implements ValidatorConstraintInterface {
  /**
   * Validates if the property is required based on conditions
   *
   * @param value - The value of the property being validated
   * @param args - Validation arguments containing constraints and object
   * @returns True if validation passes, false otherwise
   */
  validate(value: any, args: ValidationArguments): boolean {
    const options = args.constraints[0] as IsRequiredIfOptions;
    const object = args.object;

    // Check if conditions are met
    const conditionsMet = this.evaluateConditions(options, object);

    // If conditions are met, the field is required (must not be null/undefined/empty)
    if (conditionsMet) {
      return this.isNotEmpty(value);
    }

    // If conditions are not met, field is optional
    return true;
  }

  /**
   * Default error message for validation failure
   *
   * @param args - Validation arguments
   * @returns Error message string
   */
  defaultMessage(args: ValidationArguments): string {
    const options = args.constraints[0] as IsRequiredIfOptions;
    
    if (options.message) {
      return options.message;
    }

    return `${args.property} is required when specified conditions are met`;
  }

  /**
   * Evaluates conditions based on logical operator
   *
   * @param options - IsRequiredIf options containing conditions
   * @param object - The object being validated
   * @returns True if conditions are met
   */
  private evaluateConditions(options: IsRequiredIfOptions, object: any): boolean {
    const { condition, operator = LogicalOperator.AND } = options;
    
    // Convert single condition to array for uniform processing
    const conditions = Array.isArray(condition) ? condition : [condition];
    
    if (operator === LogicalOperator.OR) {
      return conditions.some(cond => cond(object));
    }
    
    // Default: AND operator
    return conditions.every(cond => cond(object));
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
 * IsRequiredIf decorator for conditional field validation
 *
 * Validates that a field is required only when specified conditions are met.
 * Supports single or multiple conditions with AND/OR logical operators.
 *
 * @example
 * ```typescript
 * class StorageConfig {
 *   @IsString()
 *   provider: string;
 *
 *   @IsRequiredIf({
 *     condition: (obj) => obj.provider === 's3',
 *     message: 'AWS access key is required when using S3 provider'
 *   })
 *   @IsString()
 *   awsAccessKey?: string;
 *
 *   @IsRequiredIf({
 *     condition: [
 *       (obj) => obj.provider === 's3',
 *       (obj) => obj.environment === 'production'
 *     ],
 *     operator: LogicalOperator.AND,
 *     message: 'AWS secret key is required for S3 in production'
 *   })
 *   @IsString()
 *   awsSecretKey?: string;
 * }
 * ```
 *
 * @param options - Configuration options for the decorator
 * @param validationOptions - Standard class-validator options
 * @returns Property decorator function
 */
export function IsRequiredIf(
  options: IsRequiredIfOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [options],
      validator: IsRequiredIfConstraint,
    });
  };
}

/**
 * Helper functions for common condition patterns
 */
export const ConditionHelpers = {
  /**
   * Creates a condition that checks if a property equals a specific value
   *
   * @param propertyName - Name of the property to check
   * @param value - Value to compare against
   * @returns Condition function
   */
  propertyEquals: (propertyName: string, value: any): ConditionFunction => {
    return (obj: any) => obj[propertyName] === value;
  },

  /**
   * Creates a condition that checks if a property is in a list of values
   *
   * @param propertyName - Name of the property to check
   * @param values - Array of values to check against
   * @returns Condition function
   */
  propertyIn: (propertyName: string, values: any[]): ConditionFunction => {
    return (obj: any) => values.includes(obj[propertyName]);
  },

  /**
   * Creates a condition that checks if a property is truthy
   *
   * @param propertyName - Name of the property to check
   * @returns Condition function
   */
  propertyIsTruthy: (propertyName: string): ConditionFunction => {
    return (obj: any) => Boolean(obj[propertyName]);
  },

  /**
   * Creates a condition that checks if a property exists (not null/undefined)
   *
   * @param propertyName - Name of the property to check
   * @returns Condition function
   */
  propertyExists: (propertyName: string): ConditionFunction => {
    return (obj: any) => obj[propertyName] !== null && obj[propertyName] !== undefined;
  },

  /**
   * Creates a condition that matches a regular expression
   *
   * @param propertyName - Name of the property to check
   * @param pattern - Regular expression pattern
   * @returns Condition function
   */
  propertyMatches: (propertyName: string, pattern: RegExp): ConditionFunction => {
    return (obj: any) => {
      const value = obj[propertyName];
      return typeof value === 'string' && pattern.test(value);
    };
  },

  /**
   * Combines multiple conditions with AND operator
   *
   * @param conditions - Array of condition functions
   * @returns Combined condition function
   */
  and: (...conditions: ConditionFunction[]): ConditionFunction => {
    return (obj: any) => conditions.every(condition => condition(obj));
  },

  /**
   * Combines multiple conditions with OR operator
   *
   * @param conditions - Array of condition functions
   * @returns Combined condition function
   */
  or: (...conditions: ConditionFunction[]): ConditionFunction => {
    return (obj: any) => conditions.some(condition => condition(obj));
  },

  /**
   * Negates a condition
   *
   * @param condition - Condition function to negate
   * @returns Negated condition function
   */
  not: (condition: ConditionFunction): ConditionFunction => {
    return (obj: any) => !condition(obj);
  },
};
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Simple condition function type
 */
export type ConditionFn = (object: any) => boolean;

/**
 * Validator for conditional requirements
 */
@ValidatorConstraint({ name: 'isRequiredIf', async: false })
export class IsRequiredIfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [condition, message] = args.constraints;
    
    if (condition(args.object)) {
      return value !== null && value !== undefined && value !== '';
    }
    
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [, message] = args.constraints;
    return message || `${args.property} is required when condition is met`;
  }
}

/**
 * Simple IsRequiredIf decorator
 */
export function IsRequiredIf(
  condition: ConditionFn,
  message?: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [condition, message],
      validator: IsRequiredIfConstraint,
    });
  };
}

/**
 * Environment-based validation (simplified)
 */
export function IsRequiredInEnv(
  env: string,
  envVar: string = 'NODE_ENV',
  message?: string,
): PropertyDecorator {
  return IsRequiredIf(
    () => process.env[envVar] === env,
    message || `Field is required when ${envVar} is '${env}'`
  );
}

/**
 * Simple condition helpers
 */
export const When = {
  propertyEquals: (prop: string, value: any): ConditionFn => 
    (obj) => obj[prop] === value,
  
  propertyIn: (prop: string, values: any[]): ConditionFn => 
    (obj) => values.includes(obj[prop]),
  
  propertyExists: (prop: string): ConditionFn => 
    (obj) => obj[prop] != null,
  
  isProduction: (): ConditionFn => 
    () => process.env.NODE_ENV === 'production',
  
  isDevelopment: (): ConditionFn => 
    () => process.env.NODE_ENV === 'development',
  
  and: (...conditions: ConditionFn[]): ConditionFn => 
    (obj) => conditions.every(c => c(obj)),
  
  or: (...conditions: ConditionFn[]): ConditionFn => 
    (obj) => conditions.some(c => c(obj)),
};
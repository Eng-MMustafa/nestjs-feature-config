import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export type ConditionFn = (object: any) => boolean;
export declare class IsRequiredIfConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsRequiredIf(condition: ConditionFn, message?: string, validationOptions?: ValidationOptions): PropertyDecorator;
export declare function IsRequiredInEnv(env: string, envVar?: string, message?: string): PropertyDecorator;
export declare const When: {
    propertyEquals: (prop: string, value: any) => ConditionFn;
    propertyIn: (prop: string, values: any[]) => ConditionFn;
    propertyExists: (prop: string) => ConditionFn;
    isProduction: () => ConditionFn;
    isDevelopment: () => ConditionFn;
    and: (...conditions: ConditionFn[]) => ConditionFn;
    or: (...conditions: ConditionFn[]) => ConditionFn;
};
//# sourceMappingURL=validation.d.ts.map
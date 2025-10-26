import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export type ConditionFunction = (object: any) => boolean;
export declare enum LogicalOperator {
    AND = "AND",
    OR = "OR"
}
export interface IsRequiredIfOptions {
    condition: ConditionFunction | ConditionFunction[];
    operator?: LogicalOperator;
    message?: string;
}
export declare class IsRequiredIfConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
    private evaluateConditions;
    private isNotEmpty;
}
export declare function IsRequiredIf(options: IsRequiredIfOptions, validationOptions?: ValidationOptions): PropertyDecorator;
export declare const ConditionHelpers: {
    propertyEquals: (propertyName: string, value: any) => ConditionFunction;
    propertyIn: (propertyName: string, values: any[]) => ConditionFunction;
    propertyIsTruthy: (propertyName: string) => ConditionFunction;
    propertyExists: (propertyName: string) => ConditionFunction;
    propertyMatches: (propertyName: string, pattern: RegExp) => ConditionFunction;
    and: (...conditions: ConditionFunction[]) => ConditionFunction;
    or: (...conditions: ConditionFunction[]) => ConditionFunction;
    not: (condition: ConditionFunction) => ConditionFunction;
};
//# sourceMappingURL=is-required-if.decorator.d.ts.map
import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsRequiredInEnvConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
    private isNotEmpty;
}
export declare function IsRequiredInEnv(env: string, envVariableName?: string, validationOptions?: ValidationOptions): PropertyDecorator;
export declare const EnvironmentHelpers: {
    isProduction: () => boolean;
    isDevelopment: () => boolean;
    isStaging: () => boolean;
    isTest: () => boolean;
    isEnvironment: (env: string, envVar?: string) => boolean;
    isAnyEnvironment: (envs: string[], envVar?: string) => boolean;
    isNotDevelopment: () => boolean;
    isProductionLike: () => boolean;
};
//# sourceMappingURL=is-required-in-env.decorator.d.ts.map
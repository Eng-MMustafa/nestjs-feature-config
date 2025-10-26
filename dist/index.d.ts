export { FeatureConfigModule, InjectFeatureConfig } from './modules/feature-config.module';
export type { FeatureConfigOptions } from './modules/feature-config.module';
export { ConditionHelpers, IsRequiredIf, IsRequiredIfConstraint, LogicalOperator } from './decorators/is-required-if.decorator';
export type { ConditionFunction, IsRequiredIfOptions } from './decorators/is-required-if.decorator';
export { EnvironmentHelpers, IsRequiredInEnv, IsRequiredInEnvConstraint } from './decorators/is-required-in-env.decorator';
export { EmailConfigSchema, EmailProvider } from './schemas/email-config.schema';
export { Environment, StorageConfigSchema, StorageProvider } from './schemas/storage-config.schema';
export { EnvParser, convertEnvKeysToCamelCase, deepFreeze, extractEnvWithPrefix, formatValidationErrors, generateConfigToken, generateEnvPrefix, mergeConfigurations } from './utils/config.utils';
export type { ValidationErrorDetail, ValidationResult } from './utils/config.utils';
export interface ConfigTokenMap {
    [featureName: string]: string;
}
export type ConfigType<T> = T extends new (...args: any[]) => infer R ? R : never;
export type FeatureToken<T extends string> = `FEATURE_CONFIG_${Uppercase<T>}`;
export declare const VERSION = "1.0.0";
export declare const LIBRARY_INFO: {
    readonly name: "@eng-mmustafa/nestjs-feature-config";
    readonly version: "1.0.0";
    readonly description: "Type-safe feature configuration management for NestJS";
    readonly author: "Mohammed Mustafa";
    readonly license: "MIT";
};
//# sourceMappingURL=index.d.ts.map
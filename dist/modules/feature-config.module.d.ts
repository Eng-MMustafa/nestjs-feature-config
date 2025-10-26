import { DynamicModule, Type } from '@nestjs/common';
export interface FeatureConfigOptions<T = any> {
    featureName: string;
    schema: Type<T>;
    envPrefix?: string;
    freeze?: boolean;
    ignoreUnknownEnvVars?: boolean;
    env?: Record<string, string | undefined>;
}
export declare class FeatureConfigModule {
    static register<T>(options: FeatureConfigOptions<T>): DynamicModule;
    static registerMultiple(configs: FeatureConfigOptions[]): DynamicModule;
    static registerAsync<T>(options: {
        featureName: string;
        schema: Type<T>;
        useFactory: (...args: any[]) => Promise<Record<string, any>> | Record<string, any>;
        inject?: any[];
        freeze?: boolean;
    }): DynamicModule;
    private static createAndValidateConfig;
    private static validateAndTransformConfig;
    private static formatValidationErrors;
}
export declare function InjectFeatureConfig(featureName: string): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
//# sourceMappingURL=feature-config.module.d.ts.map
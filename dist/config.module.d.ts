import { DynamicModule } from '@nestjs/common';
export interface ConfigOptions<T = any> {
    name: string;
    schema: new () => T;
    envPrefix?: string;
    freeze?: boolean;
}
export declare class FeatureConfigModule {
    static register<T>(options: ConfigOptions<T>): DynamicModule;
    static registerMultiple(configs: ConfigOptions[]): DynamicModule;
    private static extractEnvVars;
    private static toCamelCase;
    private static createConfig;
}
export declare function ConfigToken(name: string): string;
//# sourceMappingURL=config.module.d.ts.map
export declare function generateConfigToken(featureName: string): string;
export declare function generateEnvPrefix(featureName: string): string;
export declare function extractEnvWithPrefix(prefix: string, env?: Record<string, string | undefined>): Record<string, string | undefined>;
export declare function convertEnvKeysToCamelCase(envVars: Record<string, string | undefined>): Record<string, string | undefined>;
export declare class EnvParser {
    static string(value: string | undefined, defaultValue?: string): string | undefined;
    static number(value: string | undefined, defaultValue?: number): number | undefined;
    static boolean(value: string | undefined, defaultValue?: boolean): boolean | undefined;
    static array(value: string | undefined, defaultValue?: string[]): string[] | undefined;
    static json<T = any>(value: string | undefined, defaultValue?: T): T | undefined;
}
export interface ValidationErrorDetail {
    property: string;
    value: any;
    constraints: Record<string, string>;
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrorDetail[];
    config?: any;
}
export declare function formatValidationErrors(errors: ValidationErrorDetail[]): string;
export declare function mergeConfigurations<T extends Record<string, any>>(...configs: Partial<T>[]): T;
export declare function deepFreeze<T>(obj: T): Readonly<T>;
//# sourceMappingURL=config.utils.d.ts.map
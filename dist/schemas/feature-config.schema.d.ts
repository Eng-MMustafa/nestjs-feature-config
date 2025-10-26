export declare enum AppEnvironment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production",
    TEST = "test"
}
export declare class FeatureConfigSchema {
    environment: AppEnvironment;
    apiKey?: string;
    databaseUrl?: string;
    secretKey?: string;
    debugMode?: boolean;
    queueUrl?: string;
    logLevel?: string;
    sslCertPath?: string;
    sslKeyPath?: string;
    externalServiceApiKey?: string;
    monitoringEndpoint?: string;
    featureFlagsUrl?: string;
    maxConnections?: number;
    cacheTtl?: number;
    rateLimit?: number;
    corsOrigins?: string;
    sessionSecret?: string;
    jwtSecret?: string;
    backupS3Bucket?: string;
    errorReportingApiKey?: string;
}
//# sourceMappingURL=feature-config.schema.d.ts.map
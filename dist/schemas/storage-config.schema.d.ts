export declare enum StorageProvider {
    LOCAL = "local",
    S3 = "s3",
    AZURE = "azure",
    GCS = "gcs"
}
export declare enum Environment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}
export declare class StorageConfigSchema {
    provider: StorageProvider;
    environment?: Environment;
    baseDir?: string;
    maxFileSize?: number;
    awsAccessKeyId?: string;
    awsSecretAccessKey?: string;
    s3BucketName?: string;
    s3Region?: string;
    azureAccountName?: string;
    azureAccountKey?: string;
    azureContainerName?: string;
    gcsBucketName?: string;
    gcsProjectId?: string;
    gcsKeyFilePath?: string;
    enableCompression?: boolean;
    enableEncryption?: boolean;
    cdnUrl?: string;
}
//# sourceMappingURL=storage-config.schema.d.ts.map
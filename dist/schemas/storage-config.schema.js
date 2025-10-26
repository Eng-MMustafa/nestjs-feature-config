"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageConfigSchema = exports.Environment = exports.StorageProvider = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const is_required_if_decorator_1 = require("../decorators/is-required-if.decorator");
var StorageProvider;
(function (StorageProvider) {
    StorageProvider["LOCAL"] = "local";
    StorageProvider["S3"] = "s3";
    StorageProvider["AZURE"] = "azure";
    StorageProvider["GCS"] = "gcs";
})(StorageProvider || (exports.StorageProvider = StorageProvider = {}));
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
class StorageConfigSchema {
    constructor() {
        this.baseDir = '/uploads';
        this.maxFileSize = 10485760;
        this.enableCompression = false;
        this.enableEncryption = false;
    }
}
exports.StorageConfigSchema = StorageConfigSchema;
__decorate([
    (0, class_validator_1.IsEnum)(StorageProvider, {
        message: 'Provider must be one of: local, s3, azure, gcs',
    }),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Environment),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "baseDir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], StorageConfigSchema.prototype, "maxFileSize", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
        message: 'AWS Access Key ID is required when using S3 storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "awsAccessKeyId", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
        message: 'AWS Secret Access Key is required when using S3 storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "awsSecretAccessKey", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
        message: 'S3 bucket name is required when using S3 storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "s3BucketName", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.S3),
        message: 'S3 region is required when using S3 storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "s3Region", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
        message: 'Azure Storage Account Name is required when using Azure storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "azureAccountName", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
        message: 'Azure Storage Account Key is required when using Azure storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "azureAccountKey", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.AZURE),
        message: 'Azure container name is required when using Azure storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "azureContainerName", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.GCS),
        message: 'GCS bucket name is required when using Google Cloud Storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "gcsBucketName", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.GCS),
        message: 'GCS project ID is required when using Google Cloud Storage provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "gcsProjectId", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.and(is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', StorageProvider.GCS), is_required_if_decorator_1.ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION)),
        message: 'GCS key file path is required when using Google Cloud Storage in production',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "gcsKeyFilePath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], StorageConfigSchema.prototype, "enableCompression", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.and(is_required_if_decorator_1.ConditionHelpers.propertyIn('provider', [StorageProvider.S3, StorageProvider.AZURE, StorageProvider.GCS]), is_required_if_decorator_1.ConditionHelpers.propertyEquals('environment', Environment.PRODUCTION)),
        message: 'File encryption must be enabled for cloud storage providers in production',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], StorageConfigSchema.prototype, "enableEncryption", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], StorageConfigSchema.prototype, "cdnUrl", void 0);

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
exports.FeatureConfigSchema = exports.AppEnvironment = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const is_required_if_decorator_1 = require("../decorators/is-required-if.decorator");
const is_required_in_env_decorator_1 = require("../decorators/is-required-in-env.decorator");
var AppEnvironment;
(function (AppEnvironment) {
    AppEnvironment["DEVELOPMENT"] = "development";
    AppEnvironment["STAGING"] = "staging";
    AppEnvironment["PRODUCTION"] = "production";
    AppEnvironment["TEST"] = "test";
})(AppEnvironment || (exports.AppEnvironment = AppEnvironment = {}));
class FeatureConfigSchema {
    constructor() {
        this.debugMode = false;
        this.logLevel = 'info';
        this.maxConnections = 10;
        this.cacheTtl = 300;
        this.rateLimit = 100;
    }
}
exports.FeatureConfigSchema = FeatureConfigSchema;
__decorate([
    (0, class_validator_1.IsEnum)(AppEnvironment, {
        message: 'Environment must be one of: development, staging, production, test',
    }),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "environment", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production', 'NODE_ENV', {
        message: 'API Key is required when NODE_ENV is production',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "apiKey", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production', 'APP_ENV', {
        message: 'Database URL is required when APP_ENV is production',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "databaseUrl", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "secretKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], FeatureConfigSchema.prototype, "debugMode", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: (obj) => obj.environment !== AppEnvironment.DEVELOPMENT,
        message: 'Queue URL is required in non-development environments',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "queueUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "logLevel", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "sslCertPath", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "sslKeyPath", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: (obj) => ['staging', 'production'].includes(obj.environment),
        message: 'External service API key is required in staging and production environments',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "externalServiceApiKey", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "monitoringEndpoint", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: (obj) => obj.environment !== AppEnvironment.DEVELOPMENT,
        message: 'Feature flags service URL is required in non-development environments',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "featureFlagsUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], FeatureConfigSchema.prototype, "maxConnections", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], FeatureConfigSchema.prototype, "cacheTtl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], FeatureConfigSchema.prototype, "rateLimit", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "corsOrigins", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "sessionSecret", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "jwtSecret", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "backupS3Bucket", void 0);
__decorate([
    (0, is_required_in_env_decorator_1.IsRequiredInEnv)('production'),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureConfigSchema.prototype, "errorReportingApiKey", void 0);

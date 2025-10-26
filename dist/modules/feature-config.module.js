"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FeatureConfigModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureConfigModule = void 0;
exports.InjectFeatureConfig = InjectFeatureConfig;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const config_utils_1 = require("../utils/config.utils");
let FeatureConfigModule = FeatureConfigModule_1 = class FeatureConfigModule {
    static register(options) {
        const { featureName, schema, envPrefix = (0, config_utils_1.generateEnvPrefix)(featureName), freeze = true, ignoreUnknownEnvVars = true, env = process.env, } = options;
        const configToken = (0, config_utils_1.generateConfigToken)(featureName);
        const configProvider = {
            provide: configToken,
            useFactory: () => {
                return this.createAndValidateConfig(schema, envPrefix, freeze, ignoreUnknownEnvVars, env);
            },
        };
        return {
            module: FeatureConfigModule_1,
            providers: [configProvider],
            exports: [configProvider],
            global: false,
        };
    }
    static registerMultiple(configs) {
        const providers = configs.map(config => {
            const configToken = (0, config_utils_1.generateConfigToken)(config.featureName);
            const { schema, envPrefix = (0, config_utils_1.generateEnvPrefix)(config.featureName), freeze = true, ignoreUnknownEnvVars = true, env = process.env, } = config;
            return {
                provide: configToken,
                useFactory: () => {
                    return this.createAndValidateConfig(schema, envPrefix, freeze, ignoreUnknownEnvVars, env);
                },
            };
        });
        return {
            module: FeatureConfigModule_1,
            providers,
            exports: providers,
            global: false,
        };
    }
    static registerAsync(options) {
        const { featureName, schema, useFactory, inject = [], freeze = true } = options;
        const configToken = (0, config_utils_1.generateConfigToken)(featureName);
        const configProvider = {
            provide: configToken,
            useFactory: async (...args) => {
                const rawConfig = await useFactory(...args);
                return this.validateAndTransformConfig(schema, rawConfig, freeze);
            },
            inject,
        };
        return {
            module: FeatureConfigModule_1,
            providers: [configProvider],
            exports: [configProvider],
            global: false,
        };
    }
    static createAndValidateConfig(schema, envPrefix, freeze, ignoreUnknownEnvVars, env) {
        const envVars = (0, config_utils_1.extractEnvWithPrefix)(envPrefix, env);
        const camelCaseConfig = (0, config_utils_1.convertEnvKeysToCamelCase)(envVars);
        const filteredConfig = ignoreUnknownEnvVars
            ? Object.fromEntries(Object.entries(camelCaseConfig).filter(([, value]) => value !== undefined))
            : camelCaseConfig;
        return this.validateAndTransformConfig(schema, filteredConfig, freeze);
    }
    static validateAndTransformConfig(schema, rawConfig, freeze) {
        const configInstance = (0, class_transformer_1.plainToInstance)(schema, rawConfig, {
            enableImplicitConversion: true,
            excludeExtraneousValues: false,
        });
        const validationErrors = (0, class_validator_1.validateSync)(configInstance, {
            skipMissingProperties: false,
            whitelist: true,
            forbidNonWhitelisted: false,
        });
        if (validationErrors.length > 0) {
            const errorDetails = this.formatValidationErrors(validationErrors);
            const errorMessage = (0, config_utils_1.formatValidationErrors)(errorDetails);
            throw new Error(`Configuration validation failed:\n${errorMessage}`);
        }
        if (freeze) {
            return (0, config_utils_1.deepFreeze)(configInstance);
        }
        return configInstance;
    }
    static formatValidationErrors(errors) {
        const errorDetails = [];
        const processError = (error, parentPath = '') => {
            const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;
            if (error.constraints) {
                errorDetails.push({
                    property: propertyPath,
                    value: error.value,
                    constraints: error.constraints,
                });
            }
            if (error.children && error.children.length > 0) {
                for (const childError of error.children) {
                    processError(childError, propertyPath);
                }
            }
        };
        for (const error of errors) {
            processError(error);
        }
        return errorDetails;
    }
};
exports.FeatureConfigModule = FeatureConfigModule;
exports.FeatureConfigModule = FeatureConfigModule = FeatureConfigModule_1 = __decorate([
    (0, common_1.Module)({})
], FeatureConfigModule);
function InjectFeatureConfig(featureName) {
    const token = (0, config_utils_1.generateConfigToken)(featureName);
    return function (target, propertyKey, parameterIndex) {
        const existingTokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const tokens = [...existingTokens];
        tokens[parameterIndex] = token;
        Reflect.defineMetadata('design:paramtypes', tokens, target);
    };
}

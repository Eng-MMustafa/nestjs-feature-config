"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIBRARY_INFO = exports.VERSION = exports.mergeConfigurations = exports.generateEnvPrefix = exports.generateConfigToken = exports.formatValidationErrors = exports.extractEnvWithPrefix = exports.deepFreeze = exports.convertEnvKeysToCamelCase = exports.EnvParser = exports.StorageProvider = exports.StorageConfigSchema = exports.Environment = exports.EmailProvider = exports.EmailConfigSchema = exports.IsRequiredInEnvConstraint = exports.IsRequiredInEnv = exports.EnvironmentHelpers = exports.LogicalOperator = exports.IsRequiredIfConstraint = exports.IsRequiredIf = exports.ConditionHelpers = exports.InjectFeatureConfig = exports.FeatureConfigModule = void 0;
var feature_config_module_1 = require("./modules/feature-config.module");
Object.defineProperty(exports, "FeatureConfigModule", { enumerable: true, get: function () { return feature_config_module_1.FeatureConfigModule; } });
Object.defineProperty(exports, "InjectFeatureConfig", { enumerable: true, get: function () { return feature_config_module_1.InjectFeatureConfig; } });
var is_required_if_decorator_1 = require("./decorators/is-required-if.decorator");
Object.defineProperty(exports, "ConditionHelpers", { enumerable: true, get: function () { return is_required_if_decorator_1.ConditionHelpers; } });
Object.defineProperty(exports, "IsRequiredIf", { enumerable: true, get: function () { return is_required_if_decorator_1.IsRequiredIf; } });
Object.defineProperty(exports, "IsRequiredIfConstraint", { enumerable: true, get: function () { return is_required_if_decorator_1.IsRequiredIfConstraint; } });
Object.defineProperty(exports, "LogicalOperator", { enumerable: true, get: function () { return is_required_if_decorator_1.LogicalOperator; } });
var is_required_in_env_decorator_1 = require("./decorators/is-required-in-env.decorator");
Object.defineProperty(exports, "EnvironmentHelpers", { enumerable: true, get: function () { return is_required_in_env_decorator_1.EnvironmentHelpers; } });
Object.defineProperty(exports, "IsRequiredInEnv", { enumerable: true, get: function () { return is_required_in_env_decorator_1.IsRequiredInEnv; } });
Object.defineProperty(exports, "IsRequiredInEnvConstraint", { enumerable: true, get: function () { return is_required_in_env_decorator_1.IsRequiredInEnvConstraint; } });
var email_config_schema_1 = require("./schemas/email-config.schema");
Object.defineProperty(exports, "EmailConfigSchema", { enumerable: true, get: function () { return email_config_schema_1.EmailConfigSchema; } });
Object.defineProperty(exports, "EmailProvider", { enumerable: true, get: function () { return email_config_schema_1.EmailProvider; } });
var storage_config_schema_1 = require("./schemas/storage-config.schema");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return storage_config_schema_1.Environment; } });
Object.defineProperty(exports, "StorageConfigSchema", { enumerable: true, get: function () { return storage_config_schema_1.StorageConfigSchema; } });
Object.defineProperty(exports, "StorageProvider", { enumerable: true, get: function () { return storage_config_schema_1.StorageProvider; } });
var config_utils_1 = require("./utils/config.utils");
Object.defineProperty(exports, "EnvParser", { enumerable: true, get: function () { return config_utils_1.EnvParser; } });
Object.defineProperty(exports, "convertEnvKeysToCamelCase", { enumerable: true, get: function () { return config_utils_1.convertEnvKeysToCamelCase; } });
Object.defineProperty(exports, "deepFreeze", { enumerable: true, get: function () { return config_utils_1.deepFreeze; } });
Object.defineProperty(exports, "extractEnvWithPrefix", { enumerable: true, get: function () { return config_utils_1.extractEnvWithPrefix; } });
Object.defineProperty(exports, "formatValidationErrors", { enumerable: true, get: function () { return config_utils_1.formatValidationErrors; } });
Object.defineProperty(exports, "generateConfigToken", { enumerable: true, get: function () { return config_utils_1.generateConfigToken; } });
Object.defineProperty(exports, "generateEnvPrefix", { enumerable: true, get: function () { return config_utils_1.generateEnvPrefix; } });
Object.defineProperty(exports, "mergeConfigurations", { enumerable: true, get: function () { return config_utils_1.mergeConfigurations; } });
exports.VERSION = '1.0.0';
exports.LIBRARY_INFO = {
    name: '@eng-mmustafa/nestjs-feature-config',
    version: exports.VERSION,
    description: 'Type-safe feature configuration management for NestJS',
    author: 'Mohammed Mustafa',
    license: 'MIT',
};

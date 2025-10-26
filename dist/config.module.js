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
exports.ConfigToken = ConfigToken;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let FeatureConfigModule = FeatureConfigModule_1 = class FeatureConfigModule {
    static register(options) {
        const { name, schema, envPrefix, freeze = true } = options;
        const configToken = `CONFIG_${name.toUpperCase()}`;
        const provider = {
            provide: configToken,
            useFactory: () => {
                const prefix = envPrefix || name.toUpperCase();
                const envVars = this.extractEnvVars(prefix);
                const config = this.toCamelCase(envVars);
                const instance = (0, class_transformer_1.plainToInstance)(schema, config, {
                    enableImplicitConversion: true,
                });
                const errors = (0, class_validator_1.validateSync)(instance);
                if (errors.length > 0) {
                    const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
                    throw new Error(`Configuration validation failed: ${errorMessages}`);
                }
                return freeze ? Object.freeze(instance) : instance;
            },
        };
        return {
            module: FeatureConfigModule_1,
            providers: [provider],
            exports: [provider],
        };
    }
    static registerMultiple(configs) {
        const providers = configs.map(config => {
            const configToken = `CONFIG_${config.name.toUpperCase()}`;
            return {
                provide: configToken,
                useFactory: () => this.createConfig(config),
            };
        });
        return {
            module: FeatureConfigModule_1,
            providers,
            exports: providers,
        };
    }
    static extractEnvVars(prefix) {
        const result = {};
        const prefixWithUnderscore = `${prefix}_`;
        for (const [key, value] of Object.entries(process.env)) {
            if (key.startsWith(prefixWithUnderscore) && value !== undefined) {
                const newKey = key.substring(prefixWithUnderscore.length);
                result[newKey] = value;
            }
        }
        return result;
    }
    static toCamelCase(obj) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = value;
        }
        return result;
    }
    static createConfig(options) {
        const { schema, envPrefix, name, freeze = true } = options;
        const prefix = envPrefix || name.toUpperCase();
        const envVars = this.extractEnvVars(prefix);
        const config = this.toCamelCase(envVars);
        const instance = (0, class_transformer_1.plainToInstance)(schema, config, {
            enableImplicitConversion: true,
        });
        const errors = (0, class_validator_1.validateSync)(instance);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
            throw new Error(`Configuration validation failed: ${errorMessages}`);
        }
        return freeze ? Object.freeze(instance) : instance;
    }
};
exports.FeatureConfigModule = FeatureConfigModule;
exports.FeatureConfigModule = FeatureConfigModule = FeatureConfigModule_1 = __decorate([
    (0, common_1.Module)({})
], FeatureConfigModule);
function ConfigToken(name) {
    return `CONFIG_${name.toUpperCase()}`;
}

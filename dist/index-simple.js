"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIBRARY_INFO = exports.VERSION = exports.When = exports.IsRequiredInEnv = exports.IsRequiredIf = exports.ConfigToken = exports.FeatureConfigModule = void 0;
var config_module_1 = require("./config.module");
Object.defineProperty(exports, "FeatureConfigModule", { enumerable: true, get: function () { return config_module_1.FeatureConfigModule; } });
Object.defineProperty(exports, "ConfigToken", { enumerable: true, get: function () { return config_module_1.ConfigToken; } });
var validation_1 = require("./validation");
Object.defineProperty(exports, "IsRequiredIf", { enumerable: true, get: function () { return validation_1.IsRequiredIf; } });
Object.defineProperty(exports, "IsRequiredInEnv", { enumerable: true, get: function () { return validation_1.IsRequiredInEnv; } });
Object.defineProperty(exports, "When", { enumerable: true, get: function () { return validation_1.When; } });
exports.VERSION = '2.0.0-simplified';
exports.LIBRARY_INFO = {
    name: '@eng-mmustafa/nestjs-feature-config',
    version: exports.VERSION,
    description: 'Ultra-simple, type-safe configuration management for NestJS',
    author: 'Mohammed Mustafa',
    license: 'MIT',
};

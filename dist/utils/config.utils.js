"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvParser = void 0;
exports.generateConfigToken = generateConfigToken;
exports.generateEnvPrefix = generateEnvPrefix;
exports.extractEnvWithPrefix = extractEnvWithPrefix;
exports.convertEnvKeysToCamelCase = convertEnvKeysToCamelCase;
exports.formatValidationErrors = formatValidationErrors;
exports.mergeConfigurations = mergeConfigurations;
exports.deepFreeze = deepFreeze;
function generateConfigToken(featureName) {
    const normalizedName = featureName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    return `FEATURE_CONFIG_${normalizedName}`;
}
function generateEnvPrefix(featureName) {
    return `${featureName.toUpperCase()}_`;
}
function extractEnvWithPrefix(prefix, env = process.env) {
    const result = {};
    Object.keys(env).forEach(key => {
        if (key.startsWith(prefix)) {
            const newKey = key.substring(prefix.length);
            result[newKey] = env[key];
        }
    });
    return result;
}
function convertEnvKeysToCamelCase(envVars) {
    const result = {};
    Object.entries(envVars).forEach(([key, value]) => {
        const camelCaseKey = key
            .toLowerCase()
            .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelCaseKey] = value;
    });
    return result;
}
class EnvParser {
    static string(value, defaultValue) {
        return value ?? defaultValue;
    }
    static number(value, defaultValue) {
        if (value === undefined)
            return defaultValue;
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    static boolean(value, defaultValue) {
        if (value === undefined)
            return defaultValue;
        return value.toLowerCase() === 'true';
    }
    static array(value, defaultValue) {
        if (value === undefined)
            return defaultValue;
        return value.split(',').map(item => item.trim()).filter(Boolean);
    }
    static json(value, defaultValue) {
        if (value === undefined)
            return defaultValue;
        try {
            return JSON.parse(value);
        }
        catch {
            return defaultValue;
        }
    }
}
exports.EnvParser = EnvParser;
function formatValidationErrors(errors) {
    if (errors.length === 0) {
        return 'Configuration is valid';
    }
    const errorMessages = errors.map(error => {
        const constraints = Object.values(error.constraints).join(', ');
        return `  - ${error.property}: ${constraints}`;
    });
    return `Configuration validation failed:\n${errorMessages.join('\n')}`;
}
function mergeConfigurations(...configs) {
    const result = {};
    for (const config of configs) {
        Object.assign(result, config);
    }
    return result;
}
function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(prop => {
        const value = obj[prop];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    });
    return Object.freeze(obj);
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentHelpers = exports.IsRequiredInEnvConstraint = void 0;
exports.IsRequiredInEnv = IsRequiredInEnv;
const class_validator_1 = require("class-validator");
let IsRequiredInEnvConstraint = class IsRequiredInEnvConstraint {
    validate(value, args) {
        const [requiredEnv, envVariableName = 'NODE_ENV'] = args.constraints;
        const currentEnv = process.env[envVariableName];
        if (currentEnv === requiredEnv) {
            return this.isNotEmpty(value);
        }
        return true;
    }
    defaultMessage(args) {
        const [requiredEnv, envVariableName = 'NODE_ENV'] = args.constraints;
        return `${args.property} is required when ${envVariableName} is '${requiredEnv}'`;
    }
    isNotEmpty(value) {
        return value !== null && value !== undefined && value !== '';
    }
};
exports.IsRequiredInEnvConstraint = IsRequiredInEnvConstraint;
exports.IsRequiredInEnvConstraint = IsRequiredInEnvConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isRequiredInEnv', async: false })
], IsRequiredInEnvConstraint);
function IsRequiredInEnv(env, envVariableName = 'NODE_ENV', validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [env, envVariableName],
            validator: IsRequiredInEnvConstraint,
        });
    };
}
exports.EnvironmentHelpers = {
    isProduction: () => process.env.NODE_ENV === 'production',
    isDevelopment: () => process.env.NODE_ENV === 'development',
    isStaging: () => process.env.NODE_ENV === 'staging',
    isTest: () => process.env.NODE_ENV === 'test',
    isEnvironment: (env, envVar = 'NODE_ENV') => process.env[envVar] === env,
    isAnyEnvironment: (envs, envVar = 'NODE_ENV') => envs.includes(process.env[envVar] || ''),
    isNotDevelopment: () => process.env.NODE_ENV !== 'development',
    isProductionLike: () => ['production', 'staging'].includes(process.env.NODE_ENV || ''),
};

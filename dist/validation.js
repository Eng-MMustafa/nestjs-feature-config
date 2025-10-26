"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.When = exports.IsRequiredIfConstraint = void 0;
exports.IsRequiredIf = IsRequiredIf;
exports.IsRequiredInEnv = IsRequiredInEnv;
const class_validator_1 = require("class-validator");
let IsRequiredIfConstraint = class IsRequiredIfConstraint {
    validate(value, args) {
        const [condition, message] = args.constraints;
        if (condition(args.object)) {
            return value !== null && value !== undefined && value !== '';
        }
        return true;
    }
    defaultMessage(args) {
        const [, message] = args.constraints;
        return message || `${args.property} is required when condition is met`;
    }
};
exports.IsRequiredIfConstraint = IsRequiredIfConstraint;
exports.IsRequiredIfConstraint = IsRequiredIfConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isRequiredIf', async: false })
], IsRequiredIfConstraint);
function IsRequiredIf(condition, message, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [condition, message],
            validator: IsRequiredIfConstraint,
        });
    };
}
function IsRequiredInEnv(env, envVar = 'NODE_ENV', message) {
    return IsRequiredIf(() => process.env[envVar] === env, message || `Field is required when ${envVar} is '${env}'`);
}
exports.When = {
    propertyEquals: (prop, value) => (obj) => obj[prop] === value,
    propertyIn: (prop, values) => (obj) => values.includes(obj[prop]),
    propertyExists: (prop) => (obj) => obj[prop] != null,
    isProduction: () => () => process.env.NODE_ENV === 'production',
    isDevelopment: () => () => process.env.NODE_ENV === 'development',
    and: (...conditions) => (obj) => conditions.every(c => c(obj)),
    or: (...conditions) => (obj) => conditions.some(c => c(obj)),
};

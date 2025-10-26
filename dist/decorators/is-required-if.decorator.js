"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionHelpers = exports.IsRequiredIfConstraint = exports.LogicalOperator = void 0;
exports.IsRequiredIf = IsRequiredIf;
const class_validator_1 = require("class-validator");
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator["AND"] = "AND";
    LogicalOperator["OR"] = "OR";
})(LogicalOperator || (exports.LogicalOperator = LogicalOperator = {}));
let IsRequiredIfConstraint = class IsRequiredIfConstraint {
    validate(value, args) {
        const options = args.constraints[0];
        const object = args.object;
        const conditionsMet = this.evaluateConditions(options, object);
        if (conditionsMet) {
            return this.isNotEmpty(value);
        }
        return true;
    }
    defaultMessage(args) {
        const options = args.constraints[0];
        if (options.message) {
            return options.message;
        }
        return `${args.property} is required when specified conditions are met`;
    }
    evaluateConditions(options, object) {
        const { condition, operator = LogicalOperator.AND } = options;
        const conditions = Array.isArray(condition) ? condition : [condition];
        if (operator === LogicalOperator.OR) {
            return conditions.some(cond => cond(object));
        }
        return conditions.every(cond => cond(object));
    }
    isNotEmpty(value) {
        return value !== null && value !== undefined && value !== '';
    }
};
exports.IsRequiredIfConstraint = IsRequiredIfConstraint;
exports.IsRequiredIfConstraint = IsRequiredIfConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isRequiredIf', async: false })
], IsRequiredIfConstraint);
function IsRequiredIf(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsRequiredIfConstraint,
        });
    };
}
exports.ConditionHelpers = {
    propertyEquals: (propertyName, value) => {
        return (obj) => obj[propertyName] === value;
    },
    propertyIn: (propertyName, values) => {
        return (obj) => values.includes(obj[propertyName]);
    },
    propertyIsTruthy: (propertyName) => {
        return (obj) => Boolean(obj[propertyName]);
    },
    propertyExists: (propertyName) => {
        return (obj) => obj[propertyName] !== null && obj[propertyName] !== undefined;
    },
    propertyMatches: (propertyName, pattern) => {
        return (obj) => {
            const value = obj[propertyName];
            return typeof value === 'string' && pattern.test(value);
        };
    },
    and: (...conditions) => {
        return (obj) => conditions.every(condition => condition(obj));
    },
    or: (...conditions) => {
        return (obj) => conditions.some(condition => condition(obj));
    },
    not: (condition) => {
        return (obj) => !condition(obj);
    },
};

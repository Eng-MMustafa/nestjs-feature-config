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
exports.EmailConfigSchema = exports.EmailProvider = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const is_required_if_decorator_1 = require("../decorators/is-required-if.decorator");
var EmailProvider;
(function (EmailProvider) {
    EmailProvider["SMTP"] = "smtp";
    EmailProvider["SENDGRID"] = "sendgrid";
    EmailProvider["MAILGUN"] = "mailgun";
    EmailProvider["SES"] = "ses";
})(EmailProvider || (exports.EmailProvider = EmailProvider = {}));
class EmailConfigSchema {
    constructor() {
        this.enabled = true;
        this.smtpSecure = true;
        this.maxRetries = 3;
        this.rateLimit = 100;
        this.enableTemplates = true;
    }
}
exports.EmailConfigSchema = EmailConfigSchema;
__decorate([
    (0, class_validator_1.IsEnum)(EmailProvider, {
        message: 'Provider must be one of: smtp, sendgrid, mailgun, ses',
    }),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "fromEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "fromName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], EmailConfigSchema.prototype, "enabled", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
        message: 'SMTP host is required when using SMTP provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "smtpHost", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
        message: 'SMTP port is required when using SMTP provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value, 10)),
    __metadata("design:type", Number)
], EmailConfigSchema.prototype, "smtpPort", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
        message: 'SMTP username is required when using SMTP provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "smtpUsername", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SMTP),
        message: 'SMTP password is required when using SMTP provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "smtpPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], EmailConfigSchema.prototype, "smtpSecure", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SENDGRID),
        message: 'SendGrid API key is required when using SendGrid provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "sendgridApiKey", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.MAILGUN),
        message: 'Mailgun API key is required when using Mailgun provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "mailgunApiKey", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.MAILGUN),
        message: 'Mailgun domain is required when using Mailgun provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "mailgunDomain", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
        message: 'AWS SES region is required when using SES provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "sesRegion", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
        message: 'AWS Access Key ID is required when using SES provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "awsAccessKeyId", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyEquals('provider', EmailProvider.SES),
        message: 'AWS Secret Access Key is required when using SES provider',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "awsSecretAccessKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value, 10)),
    __metadata("design:type", Number)
], EmailConfigSchema.prototype, "maxRetries", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value, 10)),
    __metadata("design:type", Number)
], EmailConfigSchema.prototype, "rateLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], EmailConfigSchema.prototype, "enableTemplates", void 0);
__decorate([
    (0, is_required_if_decorator_1.IsRequiredIf)({
        condition: is_required_if_decorator_1.ConditionHelpers.propertyIsTruthy('enableTemplates'),
        message: 'Template directory path is required when templates are enabled',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailConfigSchema.prototype, "templatePath", void 0);

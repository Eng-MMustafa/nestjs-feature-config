export declare enum EmailProvider {
    SMTP = "smtp",
    SENDGRID = "sendgrid",
    MAILGUN = "mailgun",
    SES = "ses"
}
export declare class EmailConfigSchema {
    provider: EmailProvider;
    fromEmail: string;
    fromName: string;
    enabled?: boolean;
    smtpHost?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    smtpSecure?: boolean;
    sendgridApiKey?: string;
    mailgunApiKey?: string;
    mailgunDomain?: string;
    sesRegion?: string;
    awsAccessKeyId?: string;
    awsSecretAccessKey?: string;
    maxRetries?: number;
    rateLimit?: number;
    enableTemplates?: boolean;
    templatePath?: string;
}
//# sourceMappingURL=email-config.schema.d.ts.map
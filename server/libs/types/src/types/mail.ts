export interface MailJobData {
    to: string;
    subject: string;
    from?: string;
    text?: string;
    mailType: MailTypeEnum,
    payload: any
}

export enum MailTypeEnum {
    VERIFY_ACCOUNT = 'verify-account',
    RESET_PASSWORD = 'reset-password'
}
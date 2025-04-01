export type EmailBase = {
  link: string;
  username: string;
};

export type WelcomeEmail = EmailBase;

export type VerifyEmail = EmailBase;

export type ForgotPasswordEmail = EmailBase;

export type TradeCreatedEmail = EmailBase & {
  tradeResult: string;
  tradedWithUsername: string;
};

export enum EmailType {
  WELCOME = "welcome",
  VERIFY = "verify",
  FORGOT_PASSWORD = "forgot-password",
  TRADE_CREATED = "trade-created",
}

export type EmailTemplate = {
  [EmailType.WELCOME]: WelcomeEmail;
  [EmailType.VERIFY]: VerifyEmail;
  [EmailType.FORGOT_PASSWORD]: ForgotPasswordEmail;
  [EmailType.TRADE_CREATED]: TradeCreatedEmail;
};

export function getEmailTemplateType<T extends EmailType>(type: T): EmailType {
  return type;
}

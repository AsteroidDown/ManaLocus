export type WelcomeEmail = {
  username: string;
  verifyUrl: string;
};

export type VerifyEmail = {
  username: string;
  verifyUrl: string;
};

export type ForgotPasswordEmail = {
  username: string;
  resetUrl: string;
};

export enum EmailType {
  WELCOME = "welcome",
  VERIFY = "verify",
  FORGOT_PASSWORD = "forgot-password",
}

export type EmailTemplate = {
  [EmailType.WELCOME]: WelcomeEmail;
  [EmailType.VERIFY]: VerifyEmail;
  [EmailType.FORGOT_PASSWORD]: ForgotPasswordEmail;
};

export function getEmailTemplateType<T extends EmailType>(type: T): EmailType {
  return type;
}

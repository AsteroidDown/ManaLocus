export type WelcomeEmail = {
  username: string;
  verifyUrl: string;
};

export type VerifyEmail = {
  username: string;
  verifyUrl: string;
};

export enum EmailType {
  WELCOME = "welcome",
  VERIFY = "verify",
}

export type EmailTemplate = {
  [EmailType.WELCOME]: WelcomeEmail;
  [EmailType.VERIFY]: VerifyEmail;
}

export function getEmailTemplateType<T extends EmailType>(type: T): EmailType {
  return type;
}

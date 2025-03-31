import { EmailTemplate, EmailType } from "@/constants/emails";
import API from "../api-methods/api-methods";

async function send<T extends EmailType>(
  mailType: T,
  mailTo: string,
  subject: string,
  props: EmailTemplate[T],
  fromMail?: string,
) {
  return await API.post(`email/`, { mailType, mailTo, subject, props, fromMail });
}

const EmailService = {
  send,
};

export default EmailService;

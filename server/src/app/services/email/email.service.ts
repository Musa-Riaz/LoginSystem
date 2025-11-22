import {sendMail}  from "../../utils/email.util";
import { emailTemplates } from "./email.templates";
import { getVerificationLink } from "@/app/utils/general.util";

export class EmailService {
        static async sendVerificationEmail({ to, name, email, token }: { to: string; name?: string; email: string; token: string }) {
        const link = getVerificationLink({ email, token })!
        const { subject, html, text } = emailTemplates.verification({ name, link });
        await sendMail({ to, subject, html, text });
    }

    static async sendForgotPasswordEmail({ to, name, email, token }: { to: string; name?: string; email: string; token: string }) {
        const link = getVerificationLink({ email, token })!
        const { subject, html, text } = emailTemplates.forgotPassword({ name, link });
        await sendMail({ to, subject, html, text });
    }
}
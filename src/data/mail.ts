"use server";
import { Resend } from "resend";
import EmailTemplate from "./EmailTemplate";
// import { EmailTemplate } from "./email-template";

const resend = new Resend(process.env.RESENT_API_KEY);

const FROM = "EstudeAi <no-reply@ruhtra.work>";

// export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
//   await resend.emails.send({
//     from: FROM,
//     to: [email],
//     subject: "Confirm your email",
//     html: `<p>Yout 2FA code: ${token}</p>`,
//     // react: await EmailTemplate({ firstName: "John" }),
//   });
// };

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `${process.env.DNS_FRONT}/auth/new-verification?token=${token}`;

//   await resend.emails.send({
//     from: FROM,
//     to: [email],
//     subject: "Confirm your email",
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
//     // react: await EmailTemplate({ firstName: "John" }),
//   });
// };

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // const resetLink = `${process.env.DNS_FRONT}/auth/new-password?token=${token}`;

  return await resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Redefinição de Senha - EstudeAi",
    react: await EmailTemplate({
      email,
      name: "seu nome será incluido aqui",
      token,
    }),
  });
};

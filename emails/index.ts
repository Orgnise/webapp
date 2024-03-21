import { render } from "@react-email/render";
import { Resend } from 'resend';
import { createTransport } from "nodemailer"

import { JSXElementConstructor, ReactElement } from "react";

export const resend = new Resend('re_G3zUARz4_KR7HcGQBQLYxutSCaUToT8Fu');

export const sendEmail = async ({
  email,
  subject,
  from,
  text,
  react,
}: {
  email: string;
  subject: string;
  from?: string;
  text?: string;
  react?: ReactElement<any, string | JSXElementConstructor<any>>;
}) => {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log(
      'EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD must be set in the environment to send emails.'
    );
    return Promise.resolve();
  }

  const response = await resend.emails.send({
    from: 'sonu.sharma045@gmail.com',
    to: email,
    subject: subject,
    html: 'Hi',
    ...(react && { HtmlBody: render(react) }),
    ...(text && { TextBody: text }),
  });
  console.log(response);
  return response;
};



export async function sendEmailV2({ identifier, subject, text, react, }: {
  identifier: string;
  subject: string;
  text?: string;
  react?: ReactElement<any, string | JSXElementConstructor<any>>;
}) {

  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log(
      'EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD must be set in the environment to send emails.'
    );
    return Promise.resolve();
  }


  const transport = createTransport({
    pool: true,
    port: 587,
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    }
  }
  )
  const result = await transport.sendMail({
    to: identifier,
    from: 'noreply@orgnise.in',
    subject: subject,
    html: 'Hi',
    ...(react && { html: render(react) }),
    ...(text && { TextBody: text }),
  })
  console.log("--------EMAIL TO:----------")
  console.log({ accepted: result.accepted, rejected: result.rejected })
  console.log("------------------")
  const failed = result.rejected.filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}
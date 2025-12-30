import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const VerificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"Prisma Blog" <prismablog@ph.email>',
        to: user.email,
        subject: "Please Verify your Email for Prisma Blog Account",
        html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Hello ${user.name} to Prisma Blog!</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Thanks for signing up! We're excited to have you. To get started, please verify your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${VerificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #777; font-size: 14px;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; color: #007bff; font-size: 12px;">
        ${VerificationUrl}
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px; text-align: center;">
        If you did not create an account, no further action is required.
      </p>
    </div>
  `,
      });

      console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    },
  },

   socialProviders: {
        google: { 
            prompt: "select_account consent", 
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }, 
    },



});

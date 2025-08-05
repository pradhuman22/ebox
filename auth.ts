import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma/client';
import { openAPI } from 'better-auth/plugins';
import { resend } from './lib/resend';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import ResetPassword from './app/(auth)/templates/ResetPassword';
import { EmailVerification } from './app/(auth)/templates/EmailVerification';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      contact: {
        type: 'string',
      },
      bio: {
        type: 'string',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Reset Forgot Password',
        react: ResetPassword({
          url,
          name: user?.name,
        }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set('callbackURL', '/email-verified');
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Email Verification',
        react: EmailVerification(String(link), user.name),
      });
    },
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  hooks: {
    before: createAuthMiddleware(async ctx => {
      if (ctx.path == '/forget-password') {
        const email = ctx.body.email;
        const checkEmail = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (!checkEmail) {
          throw new APIError('BAD_REQUEST', {
            message: 'Reset Password: User not found',
          });
        }
        return ctx;
      }
    }),
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  plugins: [openAPI()],
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;

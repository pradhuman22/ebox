import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    inferAdditionalFields<typeof auth>({
      user: {
        bio: {
          type: 'string',
          required: false,
        },
        contact: {
          type: 'string',
          required: false,
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;

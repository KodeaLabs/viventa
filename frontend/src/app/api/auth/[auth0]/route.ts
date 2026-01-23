import { handleAuth, handleLogin, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  }),
  callback: handleCallback({
    afterCallback: async (_req: NextRequest, session: Session) => {
      // You can modify the session here if needed
      return session;
    },
  }),
});

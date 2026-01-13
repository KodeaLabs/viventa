import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  }),
  callback: handleCallback({
    afterCallback: async (req, session) => {
      // You can modify the session here if needed
      return session;
    },
  }),
});

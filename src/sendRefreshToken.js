export const sendRefreshToken = (res, token) => {
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie('jid', token, {
    httpOnly: true,
    // domain: process.env.FRONTEND_DOMAIN,
    path: '/',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
  });
};

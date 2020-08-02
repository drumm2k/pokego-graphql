export const sendRefreshToken = (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
    secure: true,
    // domain: process.env.FRONTEND_DOMAIN,
    sameSite: 'none',
  });
};

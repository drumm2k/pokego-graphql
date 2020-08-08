import { sign, verify } from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const createAccessToken = (user) => {
  const payload = {
    userId: user.id,
    userName: user.userName,
    email: user.email,
    roles: user.roles,
  };

  return sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const createRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };

  return sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const checkAuthorization = (token) => {
  try {
    const authUser = verify(token, process.env.JWT_ACCESS_SECRET);
    if (authUser) {
      return authUser;
    }
  } catch (error) {
    return null;
  }
  return null;
};

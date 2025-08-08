import jwt from 'jsonwebtoken';

export const generatedAccessToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: '1d' }
    );
    // console.log("✅ Access token generated:", token);
    return token;
  } catch (error) {
    console.error("❌ Error generating access token:", error.message);
    return null;
  }
};

export const generatedRefreshToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: '7d' }
    );
    // console.log("✅ Refresh token generated:", token);
    return token;
  } catch (error) {
    console.error("❌ Error generating refresh token:", error.message);
    return null;
  }
};

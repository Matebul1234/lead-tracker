import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    console.log("🔐 Auth middleware triggered");

    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: "Access token not found. Unauthorized",
        error: true,
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false
      });
    }

    req.userId = decoded.id;
    next();

  } catch (error) {
    console.error("❌ Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        error: true,
        success: false
      });
    }

    return res.status(500).json({
      message: error.message || "Token verification failed",
      error: true,
      success: false
    });
  }
};

export default auth;

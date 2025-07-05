import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
    console.log("middleware triggered ====>", request);

    try {
        // Get token from cookies or Authorization header
        const token = request.accesstoken|| request?.headers?.authorization?.split(" ")[1];
        console.log("Token received:", token);

        if (!token) {
            return response.status(401).json({
                message: "Provide token"
            });
        }

        // Verify the access token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        console.log("Token decoded:", decode);

        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        // Pass user id to the request object for further use
        request.userId = decode.id;

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return response.status(500).json({
            message: error.message || 'Error occurred during token verification.',
            error: true,
            success: false
        });
    }
}

export default auth;

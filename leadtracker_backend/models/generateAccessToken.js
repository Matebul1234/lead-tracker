import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const generatedAccessToken = async (userId) => {
    try {
        const token = jwt.sign(
            { id: userId },
            process.env.SECRET_KEY_ACCESS_TOKEN,
            { expiresIn: '5h' }
        );
        return token;
    } catch (error) {
        throw new Error("Error generating access token.");
    }
};

export default generatedAccessToken;

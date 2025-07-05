import jwt from 'jsonwebtoken';
import connection from './db.js';
import dotenv from "dotenv";
dotenv.config();

const genertedRefreshToken = async (userId) => {
    try {
        const token = jwt.sign(
            { id: userId },
            process.env.SECRET_KEY_REFRESH_TOKEN,
            { expiresIn: '7d' }
        );

        // Await the DB update
        await new Promise((resolve, reject) => {
            const sql = `UPDATE user SET refresh_token = ? WHERE id = ?`;
            connection.query(sql, [token, userId], (error, result) => {
                if (error) {
                    console.error("Failed to update refresh token in database:", error);
                    return reject(error);
                }
                resolve(result);
            });
        });

        // console.log("Refresh Token generated and saved:", token);
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw error;  // Let caller handle it
    }
};

export default genertedRefreshToken;

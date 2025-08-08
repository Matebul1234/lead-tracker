import bcrypt from 'bcryptjs';
import connection from "../models/db.js";

import generatedOtp from '../models/generateOtp.js';
import nodemailer from 'nodemailer';
import { generatedAccessToken, generatedRefreshToken } from '../utils/token.js';



// user register
export const userRegister = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        if (name === password) {
            return res.status(400).json({
                message: "name and Password can't be the same",
                error: true,
                success: false,
            });
        }

        const [existingUsers] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
                error: true,
                success: false,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const role = "user";
        await connection.execute('INSERT INTO user (email, name, password, role) VALUES (?, ?, ?, ?)', [email, name, hashPassword, role]);

        return res.status(200).json({
            message: "User added successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// user login
export const userLogin = async (req, res) => {
    // console.log("📥 Incoming login request:", req.body);

    try {
        const { email, password } = req.body;

        // ✅ Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password.",
                error: true,
                success: false,
            });
        }

        // console.log("🔍 Checking user in database...");

        // 🔍 Look up the user by email
        const [users] = await connection.execute(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not registered.",
                error: true,
                success: false,
            });
        }

        const user = users[0];
        const hashedPassword = user.password?.toString();

        // 🔐 Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Password incorrect.",
                error: true,
                success: false,
            });
        }

        // console.log("✅ Password valid. Generating tokens...");

        // 🔑 Generate tokens
        const accessToken = await generatedAccessToken(user.id);
        const refreshToken = await generatedRefreshToken(user.id); // Ensure this function name is correct

        // console.log("🎟️ Tokens generated:", { accessToken, refreshToken });

        // 🕓 Update last login time
        await connection.execute(
            'UPDATE user SET last_login_date = NOW() WHERE id = ?',
            [user.id]
        );

        // 🌐 Determine environment
        const isProduction = process.env.IS_PRODUCTION === 'true';
        // console.log("🌍 Environment:", isProduction ? "Production" : "Development");

        // 🍪 Set secure cookies
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'Lax' : 'None'
        };

        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        // 🎉 Respond with success
        return res.json({
            message: "Login successful.",
            error: false,
            success: true,
            accessToken,
            refreshToken,
            userdata: user
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};



// logout user
export const userLogout = async (req, res) => {
    try {
        const userId = req.userId;
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.clearCookie("accessToken", cookiesOption);
        res.clearCookie("refreshToken", cookiesOption);

        await connection.execute('UPDATE user SET refresh_token = NULL WHERE id = ?', [userId]);

        return res.json({
            message: "Logout successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// forgot password
export const usePasswordForgot = async (req, res) => {
    try {
        const { email } = req.body;

        const [user] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({
                message: "User with this email does not exist",
                error: true,
                success: false
            });
        }

        const otp = generatedOtp();
        const expireTime = new Date(Date.now() + 60 * 60 * 1000);
        await connection.execute('UPDATE user SET forgot_password_otp = ?, forgot_password_otp_expiry = ? WHERE email = ?', [otp, expireTime, email]);

        await sendOtpEmail(email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
            error: false,
            success: true,
            otp
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// send email
export const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mohammadmatebul047890@gmail.com',
            pass: 'sfwu nlse hhtd ymey'
        }
    });

    const mailOptions = {
        from: 'NS3TECHSOLUTIONS <mohammadmatebul047890@gmail.com>',
        to: email,
        subject: 'Your OTP for password reset',
        html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
};

// reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const [user] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email]);

        return res.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
};



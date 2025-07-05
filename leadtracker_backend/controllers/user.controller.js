
import bcrypt from 'bcryptjs';
import connection from "../models/db.js";
import generatedAccessToken from "../models/generateAccessToken.js";
import genertedRefreshToken from "../models/generateRefreshToken.js";
import { request, response } from 'express';
import generatedOtp from '../models/generateOtp.js';
import nodemailer from 'nodemailer';

//user register 
export const userRegister = async (request, response) => {
    console.log(request.body, "bodyy")
    try {
        const { email, name, password } = request.body;

        // Check if all fields are provided
        if (!email || !name || !password) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        // Ensure name and password are not the same
        if (name === password) {
            return response.status(400).json({
                message: "name and Password can't be the same",
                error: true,
                success: false,
            });
        }

        // Check if the email already exists in the database
        const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
        connection.query(checkEmailQuery, [email], async (err, result) => {
            if (err) {
                return response.status(500).json({
                    message: err.message || err,
                    error: true,
                    success: false
                });
            }

            // If email already exists
            if (result.length > 0) {
                return response.status(400).json({
                    message: "Email already exists",
                    error: true,
                    success: false,
                });
            }

            // Hash the password
            const hashPassword = await bcrypt.hash(password, 10); // Hash the password with a salt of 10
            //user role by default 
            const role = "user"
            // Format the data to insert
            const insertQuery = 'INSERT INTO user (email, name, password,role) VALUES (?, ?, ?,?)';
            connection.query(insertQuery, [email, name, hashPassword, role], (err, result) => {
                if (err) {
                    return response.status(500).json({
                        message: err.message || err,
                        error: true,
                        success: false,
                    });
                }

                return response.status(200).json({
                    message: "User added successfully",
                    error: false,
                    success: true,
                });
            });
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// user Login 
export const userLogin = async (request, response) => {
    try {
        const { email, password } = request.body;


        // Validate inputs
        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide both email and password.",
                error: true,
                success: false,
            });
        }

        // Check if the user exists
        const sql = `SELECT * FROM user WHERE email = ?`;
        connection.query(sql, [email], async (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return response.status(500).json({
                    message: error.message || "Database error",
                    error: true,
                    success: false,
                });
            }

            if (results.length === 0) {
                return response.status(400).json({
                    message: "User not registered.",
                    error: true,
                    success: false,
                });
            }

            const userdata = results[0];
            // console.log("User found:", userdata);

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, userdata.password);
            // console.log("Password valid:", isPasswordValid);

            if (!isPasswordValid) {
                return response.status(400).json({
                    message: "Password incorrect.",
                    error: true,
                    success: false,
                });
            }

            // Generate tokens
            const accesstoken = await generatedAccessToken(userdata.id);
            const refreshToken = await genertedRefreshToken(userdata.id);

            // console.log("Tokens generated:", { accesstoken, refreshToken });

            // Update last login date
            const updateSql = `UPDATE user SET last_login_date = NOW() WHERE id = ?`;
            connection.query(updateSql, [userdata.id], (updateErr) => {
                if (updateErr) {
                    console.error("Failed to update last login date:", updateErr);
                    return response.status(500).json({
                        message: updateErr.message || "Failed to update last login date",
                        error: true,
                        success: false,
                    });
                }

                // Set cookies and send final response only after DB update succeeds
                const cookiesOption = {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                };
                response.cookie('accessToken', accesstoken, cookiesOption);
                response.cookie('refreshToken', refreshToken, cookiesOption);

                return response.json({
                    message: "Login successful.",
                    error: false,
                    success: true,
                    accesstoken,
                    refreshToken,
                    userdata

                });
            });
        });
    } catch (error) {
        console.error("Internal server error:", error);
        return response.status(500).json({
            message: error.message || "Internal server error.",
            error: true,
            success: false,
        });
    }
};


//logout user

export const userLogout = async (request, response) => {
    try {
        const userId = request.userId // from middleware
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        // Clear both access and refresh tokens from cookies
        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        // Remove refresh token from database (set it to null)
        const sql = `UPDATE user SET refresh_token = NULL WHERE id = ?`;
        connection.query(sql, [userId], (error, result) => {
            if (error) {
                return response.status(400).json({
                    message: error.message || error,
                    error: true,
                    success: false
                });
            }
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// forgot user password 

export const usePasswordForgot = async (request, response) => {
    console.log(request.body);
    try {
        const { email } = request.body;

        // Check if email exists
        const sql = `SELECT * FROM user WHERE email = ?`;

        // Wrap database queries in promises for proper async/await handling
        const userExists = await new Promise((resolve, reject) => {
            connection.query(sql, [email], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        if (!userExists || userExists.length === 0) {
            return response.status(404).json({
                message: "User with this email does not exist",
                error: true,
                success: false
            });
        }

        // Generate OTP and expiry time
        const otp = generatedOtp();
        const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1hr from now

        // Update OTP and expiry time in user table
        const otpsql = `UPDATE user SET forgot_password_otp = ?, forgot_password_otp_expiry = ? WHERE email = ?`;

        await new Promise((resolve, reject) => {
            connection.query(otpsql, [otp, expireTime, email], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        // Send email with OTP (you'll need to implement your email service)
        try {
            await sendOtpEmail(email, otp); // Implement this function

        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            return response.status(500).json({
                message: "OTP generated but failed to send email",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: "OTP sent successfully",
            error: false,
            success: true,
            otp
        });

    } catch (error) {
        console.error("Error in forgot password:", error);
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// nodemailer configuration
export const sendOtpEmail = async (email, otp) => {
    // configure your SMTP transporter (example with Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mohammadmatebul047890@gmail.com',
            pass: 'sfwu nlse hhtd ymey' // recommended: use App Password, not your real password
        }
    });

    const mailOptions = {
        from: '"NS3TECHSOLUTIONS" <mohammadmatebul047890@gmail.com>',
        to: email,
        subject: 'Your OTP for password reset',
        text: `Your OTP is: ${otp}. It will expire in 1 hour.`,
        html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
};

/// reset password
export const resetPassword = async (request, response) => {
    console.log(request.body, "bodyyyy");
    const { email, newPassword } = request.body;

    try {
        if (!email || !newPassword) {
            return response.status(400).json({
                message: "Enter your new password",
                error: true,
                success: false
            });
        }

        // check if user exists
        const sqlSelect = `SELECT * FROM user WHERE email = ?`;
        const user = await new Promise((resolve, reject) => {
            connection.query(sqlSelect, [email], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        if (user.length === 0) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update the password in database
        const sqlUpdate = `UPDATE user SET password = ? WHERE email = ?`;
        await new Promise((resolve, reject) => {
            connection.query(sqlUpdate, [hashedPassword, email], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error in reset password:", error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
};


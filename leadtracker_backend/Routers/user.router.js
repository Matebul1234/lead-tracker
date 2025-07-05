import { Router } from "express";
import { resetPassword, usePasswordForgot, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import auth from "../Middlewares/auth.js";


const userRouter = Router();

// user register
userRouter.post('/register',userRegister)

// user login
userRouter.post('/login',userLogin)

//user logout 
userRouter.post('/logout',auth,userLogout)
//forgot password 
userRouter.post("/forgot-password",usePasswordForgot);
userRouter.post("/reset-password",resetPassword);


export default userRouter;
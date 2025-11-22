import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/api";
import { hashPassword, comparePassword } from "../utils/hash.util";
import { issueToken, generatePasswordResetToken } from "../utils/token.util";
import User from "../../models/user.model";
import { EmailService } from "../services/email/email.service"; 
import {ForgotPasswordUseCase} from '..//use-cases/ForgotPassword'
// import { sendEmail } from "../utils/email.util"; // Uncomment when ready

export async function signup(req: Request, res: Response): Promise<void> {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        //find if the user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError({
                res,
                error: 'User already exists',
                details: null,
                status: 400
            })
        }

        // hash the password
        const hashedPassword = await hashPassword(password);
        //creating the user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        })

        //removing the password field from the response
        const userObj = newUser.toObject();
        delete (userObj as any).password;

        return sendSuccess({
            res,
            data: userObj,
            message: "User registered successfully.",
            status: 201
        })

    }
    catch (err) {
        return sendError({
            res,
            error: 'Failed to register user',
            details: err as any,
            status: 500
        })
    }
}

export async function login(req: Request, res: Response): Promise<void> {

    try {
        const { email, password } = req.body;

        //find the user
        const user = await User.findOne({ email });
        if (!user) {
            return sendError({ res, error: 'User not found', details: null, status: 404 })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return sendError({ res, error: 'Invalid credentials', details: null, status: 401 })
        }
        const userObj = user.toObject();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (userObj as any).password;

        // creating jwt token 
        const token = issueToken({
            userId: (user as any)._id.toString(),
            email: user.email,
            role: user.role
        })

        return sendSuccess({
            res,
            data: { user: userObj, token },
            message: "User Logged In successfully",
            status: 200
        })
    }
    catch (err) {
        return sendError({ res, error: 'Failed to login user', details: err as any, status: 500 })
    }

}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;

        //finding user
        const user = await User.findOne({ email });
        if (!user) {
            return sendError({ res, error: 'User not found with this email', details: null, status: 404 })
        }

        //generating a random token
        const result = await ForgotPasswordUseCase(email);
        if (!result) {
            return sendError({ res, error: 'Failed to forgot password', details: null, status: 500 })
        }

       // Send password reset email
      if (result.email && result.passwordResetToken) {
        EmailService.sendForgotPasswordEmail({
          to: result.email,
          name: result.name,
          email: result.email,
          token: result.passwordResetToken
        });
      }

    }
    catch (err) {
        return sendError({ res, error: 'Failed to forgot password', details: err as any, status: 500 })
    }
}

// export async function resetPassword(req: Request, res: Response): Promise<void> {
//     try {
//         const { token } = req.params;
//         const { password } = req.body;

//         const user = await User.findOne({
//             resetPasswordToken: token,
//             resetPasswordExpires: { $gt: Date.now() }
//         });

//         if (!user) {
//             return sendError({ res, error: 'Password reset token is invalid or has expired', details: null, status: 400 });
//         }

//         // Hash new password
//         const hashedPassword = await hashPassword(password);
//         user.password = hashedPassword;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//         await user.save();

//         return sendSuccess({
//             res,
//             data: null,
//             message: 'Password has been updated successfully.',
//             status: 200
//         });
//     } catch (err) {
//         return sendError({ res, error: 'Failed to reset password', details: err as any, status: 500 });
//     }
// }
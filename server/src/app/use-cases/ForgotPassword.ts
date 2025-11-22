import User from "../../models/user.model";
import { generatePasswordResetToken } from "../utils/token.util";

export interface ForgotPasswordResult {
    name: string;
    email: string;
    passwordResetToken: string | undefined;
    passwordResetExpires: Date | undefined;
}

export async function forgotPasswordUseCase(email: string): Promise<ForgotPasswordResult | undefined> {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return { name: '', email, passwordResetToken: '', passwordResetExpires: new Date() };
        }

        //generate password reset token
        const passwordResetToken = generatePasswordResetToken();
        const passwordResetExpires = Date.now() + 3600000; //1 hour

        //set password reset token
        const res = await User.findByIdAndUpdate(user._id, { passwordResetToken, passwordResetExpires }, { new: true })
            .select('+passwordResetToken +passwordResetExpires');

        if (!res) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return { name: '', email, passwordResetToken: '', passwordResetExpires: new Date() };
        }

        return {
            name: res.firstName + ' ' + res.lastName,
            email: res.email,
            passwordResetToken: res.passwordResetToken,
            passwordResetExpires: res.passwordResetExpires
        }

    }
    catch (err) {
        console.log("There was an error in forgotPasswordUseCase", err)
        throw err;
    }
}
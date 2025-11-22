export const getVerificationLink = ({ email, token }: { email: string, token: string }) => {
    if (!token || !email) return;
    return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?email=${email}&token=${token}`;
}

export const getResetPasswordLink = ({ token }: { token: string }) => {
    return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
}
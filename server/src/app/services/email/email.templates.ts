export const emailTemplates = {
  verification: ({ name, link }: { name?: string | undefined; link: string }) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome${name ? `, ${name}` : ''}!</h2>
        <p>Thank you for registering with " " . Please verify your email address by clicking the button below:</p>
        <a href="${link}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;">Verify Email</a>
        <p>If you did not create an account, you can safely ignore this email.</p>
      </div>
    `,
    text: `Welcome${name ? `, ${name}` : ''}!
Thank you for registering with " ". Please verify your email address by visiting: ${link}
If you did not create an account, you can ignore this email.`
  }),

  forgotPassword: ({ name, link }: { name?: string | undefined; link: string }) => ({
    subject: 'Reset your " " password',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request${name ? ` for ${name}` : ''}</h2>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${link}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
    text: `Password Reset Request${name ? ` for ${name}` : ''}
Reset your password by visiting: ${link}
If you did not request this, you can ignore this email.`
  })
};

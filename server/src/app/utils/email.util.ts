import nodemailer from 'nodemailer';

// Create reusable transporter using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }   
});


//Sending email using nodemailer

interface EmailParams {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendMail({to, subject, html, text}: EmailParams): Promise<void>{

    try{
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM || process.env.SMTP_USER,
    //   to,
    //   subject,
    //   html,
    //   text,
    // });
    console.log('PENDING: Sending email to', to, 'with subject', subject, 'and html', html, 'and text', text)
    }
    catch(err){
    // Log error and rethrow for upstream handling
    console.error('Nodemailer sendMail error:', err);
    throw err;
    }

}
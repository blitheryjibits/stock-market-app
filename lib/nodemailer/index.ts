import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE } from './templates';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    },
});

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE 
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

        const mailOptions = {
            from: `"Stocktake" <robert.thornton92@gmail.com>`,
            to: email,
            subject: 'Welcome to stocktake! - Your Stock Market Companion',
            text: 'Thanks for signing up to stocktake!',
            html: htmlTemplate,
        }
    
    await transporter.sendMail(mailOptions);
}

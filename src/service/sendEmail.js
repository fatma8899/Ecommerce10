import nodemailer from "nodemailer";
import { join } from "path";

export const sendEmail = async (to, subject, html) =>{

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.emailSender,
        pass: process.env.password,
    },
});

    const info = await transporter.sendMail({
    from: `"batats"<${process.env.emailSender}>`, 
    to: to,
    subject: subject , 
    html: html, 
    attachments
    });
        return true;
}

export default sendEmail
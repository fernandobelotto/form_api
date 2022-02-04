import nodemailer from 'nodemailer';


export default async function sendEmail({ email, name, message }) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Personal Website',
        to: process.env.EMAIL,
        subject: `Email from blog - ${name}`,
        html: `<div><h2>${name}</h2><h3>${email}</h3><h4>${message}</h4></div>`,
    };

    await transporter.sendMail(mailOptions).catch((error) => { console.log(error); });
}
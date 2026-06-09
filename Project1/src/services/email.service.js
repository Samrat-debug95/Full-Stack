const nodemailer = require('nodemailer');
const ejs = require('ejs')
const path = require('path')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Banking System" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


const sendRegistrationEmail = async (userEmail, name) => {
    const subject = "Welcome To Banking System";

    const text = `Hello ${name} \n\nThank You for Registration at Banking System.
    we'ar excited to have you on board\n\nBest Regard,\nThe Banking System Team`;

    const html = await ejs.renderFile(
        path.join(__dirname, "../views/index.ejs"),
        { name }
    )

    await sendEmail(userEmail, subject, text, html)
}


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successfull";
    const text = `Hello ${name}, \n\nYour Transaction of ${amount}
                 to account ${toAccount} was successfull. \n\n Best Regard, \n The Banking Syatem Team`
    const html = `<h1>Hello ${name},</h1><p>Your Transaction of ${amount}
                 to account ${toAccount} was successfull.</p><h2> Best Regard, The Banking Syatem Team</h2>`

    await sendEmail(userEmail, subject, text, html)
}
async function sendTransactionFailedEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successfull";
    const text = `Hello ${name}, \n\n We regrated to inform you that your transaction of ${amount}
                 to account ${toAccount} was failed. \n\n Best Regard, \n The Banking Syatem Team`
    const html = `<h1>Hello ${name},</h1><p> We regrated to inform you that your transaction of ${amount}
                 to account ${toAccount} was failed.</p><h2> Best Regard, The Banking Syatem Team</h2>`

    await sendEmail(userEmail, subject, text, html)
}



module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail
};
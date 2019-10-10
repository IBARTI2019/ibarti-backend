const mailer = require('nodemailer');
module.exports = {
    sendOneMail
};
async function sendOneMail(config) {
    let transporter = mailer.createTransport({
        host: 'www.oesvica.com.ve',
        // secureConnection: false,
        port: 465,
        secure: true,
        requireAuth: true,

        auth: {
            user: 'info@oesvica.com.ve',
            pass: 'xx20182018'
        },
    });

    // transporter.verify(function (error, success) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Server is ready to take our messages");
    //     }});

    let options = {
        from: 'info@oesvica.com.ve', // sender address
        to: config.to, // list of receivers
        subject: config.subject, // Subject line
        text: config.text, // plain text body
        html: config.html // html body
    };

    return Promise.resolve(transporter.sendMail(options));
}
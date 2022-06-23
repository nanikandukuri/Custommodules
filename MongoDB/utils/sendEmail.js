var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//var nodeoutlook = require('nodejs-nodemailer-outlook')

var sendEmail = (email, subject, mails, text, attachments) => {
    var user_email = email
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'knani.smart9@gmail.com',
            pass: 'vqmsqqvsfpmhdefr'
        }
    }));
    var mailOptions = {
        from: 'knani.smart9@gmail.com',
        to: mails,
        subject: subject,
        html: text,
        attachments: attachments
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // logger.error(error)
        } else {
            console.log('Email sent: ' + info.response);
            //     logger.debug('Email sent: ' + info.response)
        }
    });
}

// var sendEmail = (email, subject, mails, text, attachments) => {
//     var user_email = email
//     var mail_details = {
//         auth: {
//             user: "saisarath996@gmail.com",
//             pass: "S@r@th@1996"
//         },
//         to: mails,
//         subject: subject,
//         text: text,
//         attachments: attachments
//     };

//     var mail_transporter = nodemailer.createTransport({

//         host: 'smtp.gmail.com', // Office 365 server
//         port: 587, // secure SMTP
//         auth: mail_details.auth,
//         debug: true,
//     });

//     mail_transporter.sendMail(mail_details, function (err, data) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Email sent successfully!!');
//         }
//     });
// }

// var sendEmail_outlook = function(email, subject, mails, text, attachments) {
//     nodeoutlook.sendEmail({
//         auth: {
//             user: "", //mail
//             pass: '', //password
//         },
//         from: '', //from email
//         to: mails,
//         subject: subject,
//         //html: body,
//         text: text,
//         attachments: attachments,
//         replyTo: "", //email
//         onError: (e) => console.log(e),
//         onSuccess: (i) => console.log(i)
//     })
// }

module.exports = sendEmail;
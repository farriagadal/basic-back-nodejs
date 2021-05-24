const nodemailer = require('nodemailer');
// const root = path.join(__dirname, 'emails');
// const fs = require('fs');

const Email = require('email-templates');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'f7d7cbad8ca5f6',
    pass: '801b169e892b72',
  },
});

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'neokey23@gmail.com',
//     pass: 'Neokey2323a'
//   }
// })

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
  views: { root: `${__dirname}/templates` },
});

// const mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// }

const sendConfirmationEmail = (emailOptions) => {
  email.send({
    template: 'confirmation',
    message: {
      from: 'youremail@gmail.com',
      to: emailOptions.email,
    },
    locals: {
      fname: emailOptions.firstName,
      lname: emailOptions.lastName,
      url_redirect: `${process.env.WEB_URL}/verify-email?token=${emailOptions.emailToken}`,
    },
  }).then(() => console.log('email has been sent!'));
};

module.exports = {
  sendConfirmationEmail,
};

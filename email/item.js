var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salvageportial@gmail.com',
    pass: 'Salvage1234_'
  }
});

var mailOptions = {
  from: 'salvageportial@gmail.com',
  to: 'seunolo2@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
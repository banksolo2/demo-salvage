const nodemailer = require('nodemailer'); 
require('dotenv').config();

const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD || 'No password';

let mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'salvageportial@gmail.com',
      pass: 'Salvage1234_'
    }
});


var mailOptions = {
    from: 'salvageportial@gmail.com',
    to: 'seunolo2@gmail.com',
    subject: 'Testing',
    html: `# Welcome
 
 That was easy!
 ` ,
  
};
   
mail.sendMail(mailOptions, function(error, info){
       if (error) {
         console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
});
const nodemailer = require("nodemailer");

const mailFunction = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "hotmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "dabdulxyz@gmail.com", // generated ethereal user
      pass: "Abdul@1999.com", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Triluxy 👻" <dabdulxyz@outlook.com>', // sender address
    to: "dabdulxyz@gmail.com, triluxylife@gmail.com", // list of receivers
    subject: "Hotel Booking ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Someone Just Book a Hotel</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = {
  mailFunction,
};

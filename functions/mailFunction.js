const nodemailer = require("nodemailer");
const sendMailFunction = async (reciever, subject, body) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "abdul.ibrah1999@gmail.com",
      pass: "fakikyqoyrskdujr",
    },
  });
  var mailOptions = {
    from: "abdul.ibrah1999@gmail.com",
    to: reciever,
    subject: subject,
    text: body,
  };
  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent" + info.response);
    }
  });
};
module.exports = {
  sendMailFunction,
};

const nodemailer = require("nodemailer");
const template = require("./template");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "team@simdi.in",
    pass: "KFh5MCe5kSzB"
  }
});

// 👇 emails list (private send)
const emails = [
  "someshmamgain76@gmail.com",
  "yogeshmamgain2611@gmail.com",
  "ranakotianchita1997@gmail.com"
];

async function sendBulk() {
  for (let email of emails) {
    try {
      await transporter.sendMail({
        from: '"SIMDI" <team@simdi.in>',
        to: email, // 👈 ek ek ko jayega (private)

        subject: "🌿 Fresh Pahadi Bhatt Dal – Direct from Himalayas",

        html: template,

        // 👇 spam kam karne ke liye
        headers: {
          "X-Mailer": "NodeMailer",
          "X-Priority": "3"
        }
      });

      console.log("✅ Sent to:", email);

    } catch (err) {
      console.log("❌ Error:", email, err);
    }
  }
}

sendBulk();
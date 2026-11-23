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


const emails =["maidulidp8@gmail.com", "negi.novino@gmail.com"]
async function sendBulk() {
  for (let email of emails) {
    try {
      await transporter.sendMail({
        from: '"SIMDI" <team@simdi.in>',
        to: email, // 👈 ek ek ko jayega (private)

subject: "❄️ Winter tastes better from the mountains — 10% off our new baskets",
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
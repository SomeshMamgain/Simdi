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
  "ar.pranav007@gmail.com",
  "katyura6@gmail.com",
  "kp24vy@gmail.com",
  "krantishelar@gmail.com",
  "surbhij07@gmail.com",
  "ranachiragsingh2444@gmail.com",
  "artimalhotra6@rediffmail.com",
  "deepakarana.deep@gmail.com",
  "pankajprachi72@gmail.com",
  "arjun.arya082000@gmail.com",
  "noyani123barman@gmail.com",
  "anjunath6227@gmail.com",
  "sv540704@gmail.com",
  "susheelbonthiyaal@gmail.com",
  "rohitpihu1712@gmail.com",
  "sumedhasrivastava17@gmail.com",
  "shubhanshuluckygupta123@gmail.com",
  "saumya1700@gmail.com",
  "ais2474viv@gmail.com",
  "vs7902220@gmail.com",
  "kneeraj38699@gmail.com",
  "karanhankare14@gmail.com",
  "chandras531@gmail.com",
  "manishrmehta2009@rediffmail.com",
  "gopaluk16@gmail.com",
  "vijaykatyura3253@gmail.com",
  "sharmavaibhav748@gmail.com",
  "vijaypareek18@gmail.com",
  "anjupgi@gmail.com",
  "samaladayaker@gmail.com",
  "moksha.kandpal05@gmail.com",
  "devendra.rawat07@yahoo.co.in",
  "yogendrajiruyal@gmail.com",
  "shrihitarecords@gmail.com",
  "tosifr441@gmail.com",
  "kanakpari16@gmail.com",
  "ziyahir4@gmail.com",
  "ruchi.modi@gmail.com",
  "arth.mishra95@gmail.com",
  "sauravpatel952@gmail.com",
  "yatishbisht1202@gmail.com",
  "iamanjalisharma@gmail.com",
  "suneeldubey12@gmail.com",
  "iluvinternet1117@gmail.com",
  "praveenhkrishnan@gmail.com",
  "sandeepkatyal.jpr@gmail.com",
  "sandeepkatyal1965@gmail.com",
  "lalithanumanji@gmail.com",
  "gautam.kumar23@gmail.com",
  "yogeshpant1995@gmail.com",
  "sureshangaria88@gmail.com",
  "abhisheksinghbartwal.ct@gmail.com",
  "bishnipun@gmail.com",
  "kirankiran14598@gmail.com",
  "kunalsnegi07@gmail.com",
  "nsanwal@yahoo.com",
  "crazyfooditem@gmail.com",
  "okneerajsingh@gmail.com",
  "dhruvkhankriyal@gmail.com",
  "mehebubali2001@gmail.com",
  "armanthakur591@yahoo.com",
  "kaysinc09091991@gmail.com",
  "sourabhrajput3@gmail.com",
  "rh.rohit1992@gmail.com",
  "kmamgain444@gmail.com",
  "maidulidp8@gmail.com",
  "jogipsa@gmail.com",
  "anshullekhwar2003@gmail.com",
  "singhpuneetprakash@gmail.com",

];
async function sendBulk() {
  for (let email of emails) {
    try {
      await transporter.sendMail({
        from: '"SIMDI" <team@simdi.in>',
        to: email, // 👈 ek ek ko jayega (private)

        subject: "🌺 The Himalayas bloom once a year — Buransh Juice is here",

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
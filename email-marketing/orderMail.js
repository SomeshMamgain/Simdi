const nodemailer = require("nodemailer");

// 👇 transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "team@simdi.in",
    pass: "KFh5MCe5kSzB"
  }
});

// 👇 customers (NEW ORDERS)
const customers = [
  {
    name: "Rishaan",
    email: "artimalhotra6@rediffmail.com"
  },
  {
    name: "Rajvardhan",
    email: "ranachiragsingh2444@gmail.com"
  }
];

// 👇 TEMPLATE
const getTemplate = (customer) => `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#f5f5f5;font-family:Arial, sans-serif">

<table width="100%" align="center">
<tr>
<td align="center">

<table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden">

<tr>
<td style="background:#1f4d2e;padding:20px;text-align:center">
  <img src="https://www.simdi.in/logo.jpeg" width="110" alt="SIMDI">
  <p style="color:#ffffff;font-size:12px;margin-top:6px">
    Be Pahadi • Buy Pahadi
  </p>
</td>
</tr>

<tr>
<td style="padding:25px">

<h2 style="color:#1f4d2e">Order Confirmed ✅</h2>

<p style="font-size:14px;color:#444">
Hi ${customer.name},<br><br>

Thank you for placing your order with <b>SIMDI 🌿</b>.<br>
We’ve successfully received your order and started processing it.
</p>

<div style="background:#f7f9f8;padding:15px;border-radius:8px;margin-top:15px">

<h3 style="color:#1f4d2e;margin:0 0 10px 0">🧾 Order Details</h3>

<ul style="padding-left:18px;font-size:14px;color:#333">
<li>Pisyu Loon (250g) — ₹172.99</li>
</ul>

<p style="font-weight:bold;color:#1f4d2e">
Total Paid: ₹172.99
</p>

</div>

<p style="font-size:14px;color:#444;margin-top:15px">
📦 Your order will be carefully packed and dispatched soon.
</p>

<p style="font-size:14px;color:#444">
You can track your order here:
</p>

<div style="text-align:center;margin:15px 0">
<a href="https://www.simdi.in/orders"
style="background:#1f4d2e;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:6px">
Track Your Order
</a>
</div>

<div style="text-align:center;margin-top:20px">
<a href="https://www.simdi.in"
style="background:#b58e58;color:#ffffff;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:bold">
Explore More Products
</a>
</div>

<p style="margin-top:20px;font-size:14px">
Warm regards,<br>
<b>Team SIMDI 🌿</b>
</p>

</td>
</tr>

<tr>
<td style="background:#1f4d2e;color:#ffffff;text-align:center;padding:15px;font-size:12px">
Bringing authentic Himalayan products directly to your home ❤️
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

// 👇 SEND FUNCTION
async function sendOrderMails() {
  for (let customer of customers) {
    try {
      await transporter.sendMail({
        from: '"SIMDI" <team@simdi.in>',
        to: customer.email,

        subject: `🌿 ${customer.name}, Your SIMDI Order is Confirmed`,

        html: getTemplate(customer)
      });

      console.log("✅ Sent to:", customer.email);

      // 👇 delay (important)
      await new Promise(res => setTimeout(res, 3000));

    } catch (err) {
      console.log("❌ Error:", customer.email, err);
    }
  }
}

sendOrderMails();
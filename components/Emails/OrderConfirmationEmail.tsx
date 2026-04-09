import { formatCurrencyAmount } from '@/lib/product-utils'
import { formatAddress, formatEstimatedDelivery, formatOrderDate, getPaymentStatusLabel } from '@/lib/utils/orderFormatting'
import type { OrderRecord } from '@/types/order'

interface OrderConfirmationEmailProps {
  order: OrderRecord
  appName: string
  supportEmail: string
  logoUrl?: string
  orderUrl?: string
}

const emailStyles = `
  body {
    margin: 0;
    padding: 0;
    background: #f4efe6;
    color: #1e2d24;
    font-family: Arial, Helvetica, sans-serif;
  }

  .email-shell {
    width: 100%;
    padding: 24px 12px;
  }

  .email-card {
    max-width: 680px;
    margin: 0 auto;
    background: #fffdf8;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid #eadfcd;
    box-shadow: 0 18px 36px rgba(30, 45, 36, 0.08);
  }

  .hero {
    padding: 28px 32px;
    background: linear-gradient(135deg, #11522b 0%, #2e6e45 100%);
    color: #f7f1e7;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .logo {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.12);
  }

  .eyebrow {
    margin: 0 0 8px;
    letter-spacing: 0.18em;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    opacity: 0.82;
  }

  .title {
    margin: 12px 0 0;
    font-size: 28px;
    line-height: 1.2;
  }

  .hero-copy {
    margin: 12px 0 0;
    font-size: 15px;
    line-height: 1.7;
    color: rgba(247, 241, 231, 0.9);
  }

  .section {
    padding: 28px 32px;
  }

  .section + .section {
    border-top: 1px solid #f0e5d6;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .meta-card {
    padding: 16px 18px;
    border-radius: 18px;
    background: #faf5ec;
    border: 1px solid #efe1cf;
  }

  .meta-label {
    color: #7c6d59;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .meta-value {
    display: block;
    margin-top: 8px;
    color: #1e2d24;
    font-size: 16px;
    font-weight: 700;
  }

  .section-title {
    margin: 0 0 16px;
    color: #1e2d24;
    font-size: 18px;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid #efe4d6;
  }

  .items-table th,
  .items-table td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid #f1e8dc;
    font-size: 14px;
  }

  .items-table thead th {
    background: #f8f1e7;
    color: #6f614e;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .items-table tbody tr:last-child td {
    border-bottom: 0;
  }

  .price-summary {
    width: 100%;
    border-collapse: collapse;
  }

  .price-summary td {
    padding: 8px 0;
    font-size: 14px;
    color: #4f5c53;
  }

  .price-summary td:last-child {
    text-align: right;
    color: #1e2d24;
    font-weight: 700;
  }

  .total-row td {
    padding-top: 14px;
    border-top: 1px solid #ece0ce;
    color: #1e2d24;
    font-size: 17px;
    font-weight: 800;
  }

  .status-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    background: #e8f7ec;
    color: #176539;
    font-size: 13px;
    font-weight: 700;
  }

  .address-card,
  .support-card {
    padding: 18px;
    border-radius: 18px;
    background: #faf5ec;
    border: 1px solid #efe1cf;
    color: #4b594f;
    font-size: 14px;
    line-height: 1.7;
  }

  .cta {
    display: inline-block;
    margin-top: 18px;
    padding: 12px 18px;
    border-radius: 999px;
    background: #11522b;
    color: #f7f1e7 !important;
    text-decoration: none;
    font-weight: 700;
  }

  .footer {
    padding: 24px 32px 28px;
    background: #1f2f25;
    color: rgba(247, 241, 231, 0.78);
    font-size: 13px;
    line-height: 1.7;
  }

  @media only screen and (max-width: 640px) {
    .hero,
    .section,
    .footer {
      padding-left: 20px;
      padding-right: 20px;
    }

    .meta-grid {
      grid-template-columns: 1fr;
    }

    .items-table th,
    .items-table td {
      padding: 12px 10px;
      font-size: 13px;
    }
  }
`

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderLogo(logoUrl: string | undefined, appName: string) {
  if (!logoUrl) {
    return ''
  }

  return `<img class="logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(appName)} logo" />`
}

function renderOrderRows(order: OrderRecord) {
  return order.items.map((item) => {
    return `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${item.quantity}</td>
        <td>${escapeHtml(formatCurrencyAmount(item.price))}</td>
        <td>${escapeHtml(formatCurrencyAmount(item.total))}</td>
      </tr>
    `
  }).join('')
}

export function renderOrderConfirmationEmail({
  order,
  appName,
  supportEmail,
  logoUrl,
  orderUrl,
}: OrderConfirmationEmailProps) {
  const title = `Order Confirmation - ${order.order_number}`
  const discountLabel = `Discount${order.discount_percent ? ` (${order.discount_percent}%)` : ''}`
  const cta = orderUrl
    ? `<br /><a class="cta" href="${escapeHtml(orderUrl)}">View Your Order</a>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>${emailStyles}</style>
  </head>
  <body>
    <div class="email-shell">
      <div class="email-card">
        <div class="hero">
          <div class="logo-row">
            ${renderLogo(logoUrl, appName)}
            <div>
              <p class="eyebrow">${escapeHtml(appName)}</p>
              <h1 class="title">Order Confirmation</h1>
            </div>
          </div>
          <p class="hero-copy">
            Thank you for shopping with us. Your order has been received and payment has been recorded successfully.
          </p>
        </div>

        <div class="section">
          <div class="meta-grid">
            <div class="meta-card">
              <span class="meta-label">Order Number</span>
              <span class="meta-value">${escapeHtml(order.order_number)}</span>
            </div>
            <div class="meta-card">
              <span class="meta-label">Order Date</span>
              <span class="meta-value">${escapeHtml(formatOrderDate(order.date))}</span>
            </div>
            <div class="meta-card">
              <span class="meta-label">Payment Status</span>
              <span class="meta-value"><span class="status-pill">${escapeHtml(getPaymentStatusLabel(order.payment_status))}</span></span>
            </div>
            <div class="meta-card">
              <span class="meta-label">Expected Delivery</span>
              <span class="meta-value">${escapeHtml(formatEstimatedDelivery(order))}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Items Ordered</h2>
          <table class="items-table" role="presentation">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${renderOrderRows(order)}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Pricing Summary</h2>
          <table class="price-summary" role="presentation">
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>${escapeHtml(formatCurrencyAmount(order.subtotal))}</td>
              </tr>
              <tr>
                <td>${escapeHtml(discountLabel)}</td>
                <td>- ${escapeHtml(formatCurrencyAmount(order.discount_amount))}</td>
              </tr>
              <tr>
                <td>Handling Charges (${order.handling_charge_percent}%)</td>
                <td>${escapeHtml(formatCurrencyAmount(order.handling_charges))}</td>
              </tr>
              <tr class="total-row">
                <td>Total Paid</td>
                <td>${escapeHtml(formatCurrencyAmount(order.total_amount))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Delivery Address</h2>
          <div class="address-card">${escapeHtml(formatAddress(order.delivery_address))}</div>
        </div>

        <div class="section">
          <h2 class="section-title">Need Help?</h2>
          <div class="support-card">
            Reach us anytime at <a href="mailto:${escapeHtml(supportEmail)}">${escapeHtml(supportEmail)}</a>. Keep your order number handy for faster support.
            ${cta}
          </div>
        </div>

        <div class="footer">
          ${escapeHtml(appName)} will keep you posted as your order moves from confirmation to delivery.
          <br />
          This email was sent for order ${escapeHtml(order.order_number)}.
        </div>
      </div>
    </div>
  </body>
</html>`
}

export function renderOrderConfirmationText({
  order,
  appName,
  supportEmail,
  orderUrl,
}: OrderConfirmationEmailProps) {
  return [
    `${appName} Order Confirmation`,
    '',
    `Order Number: ${order.order_number}`,
    `Order Date: ${formatOrderDate(order.date)}`,
    `Payment Status: ${getPaymentStatusLabel(order.payment_status)}`,
    `Expected Delivery: ${formatEstimatedDelivery(order)}`,
    '',
    'Items:',
    ...order.items.map((item) => `- ${item.name} x${item.quantity} - ${formatCurrencyAmount(item.total)}`),
    '',
    `Subtotal: ${formatCurrencyAmount(order.subtotal)}`,
    `Discount: -${formatCurrencyAmount(order.discount_amount)}`,
    `Handling Charges: ${formatCurrencyAmount(order.handling_charges)}`,
    `Total Paid: ${formatCurrencyAmount(order.total_amount)}`,
    '',
    `Delivery Address: ${formatAddress(order.delivery_address)}`,
    '',
    `Support: ${supportEmail}`,
    orderUrl ? `Track your order: ${orderUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function OrderConfirmationEmail(props: OrderConfirmationEmailProps) {
  return renderOrderConfirmationEmail(props)
}

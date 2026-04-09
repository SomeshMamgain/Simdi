import { renderOrderConfirmationEmail, renderOrderConfirmationText } from '@/components/Emails/OrderConfirmationEmail'
import type { OrderRecord } from '@/types/order'

type SendMailResult = {
  messageId: string
}

type MinimalTransporter = {
  sendMail: (message: {
    from: string
    to?: string
    cc?: string | string[]
    bcc?: string | string[]
    replyTo?: string
    subject: string
    html: string
    text: string
  }) => Promise<{ messageId?: string }>
}

function getEnvironmentValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]

    if (value) {
      return value
    }
  }

  return ''
}

function getBaseUrl() {
  const explicitUrl = getEnvironmentValue(
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_APP_URL',
    'SITE_URL',
    'APP_URL'
  )

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '')
  }

  const vercelUrl = getEnvironmentValue('VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_URL')

  if (!vercelUrl) {
    return ''
  }

  return vercelUrl.startsWith('http') ? vercelUrl.replace(/\/$/, '') : `https://${vercelUrl.replace(/\/$/, '')}`
}

function getZohoMailConfig() {
  const user = getEnvironmentValue('ZOHO_MAIL_USER')
  const password = getEnvironmentValue('ZOHO_MAIL_PASSWORD')
  const host = getEnvironmentValue('ZOHO_MAIL_HOST') || 'smtp.zoho.in'
  const port = Number(getEnvironmentValue('ZOHO_MAIL_PORT') || '587')

  if (!user) {
    throw new Error('Missing ZOHO_MAIL_USER')
  }

  if (!password) {
    throw new Error('Missing ZOHO_MAIL_PASSWORD')
  }

  return {
    user,
    password,
    host,
    port,
    secure: port === 465,
  }
}

function createTransporter(): MinimalTransporter {
  const nodemailer = require('nodemailer') as {
    createTransport: (config: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }) => MinimalTransporter
  }
  const config = getZohoMailConfig()

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  })
}

async function sendMailWithRetry(message: {
  to?: string
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  html: string
  text: string
}) {
  const transporter = createTransporter()
  const config = getZohoMailConfig()
  const fromName = getEnvironmentValue('APP_NAME', 'NEXT_PUBLIC_STORE_NAME') || 'SIMDI'
  const replyTo = getEnvironmentValue('APP_SUPPORT_EMAIL', 'ZOHO_MAIL_USER') || config.user
  let lastError: unknown = null

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await transporter.sendMail({
        from: `${fromName} <${config.user}>`,
        replyTo,
        ...message,
      })

      return {
        messageId: response.messageId ?? `local-${Date.now()}`,
      } satisfies SendMailResult
    } catch (error) {
      lastError = error

      if (attempt === 3) {
        throw error
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to send email')
}

export function buildOrderUrl(order: Pick<OrderRecord, '$id'>) {
  const baseUrl = getBaseUrl()

  if (!baseUrl) {
    return ''
  }

  return `${baseUrl}/orders/${order.$id}`
}

export async function sendOrderConfirmationEmail(order: OrderRecord) {
  const supportEmail = getEnvironmentValue('APP_SUPPORT_EMAIL', 'ZOHO_MAIL_USER') || 'support@simdi.in'
  const appName = getEnvironmentValue('APP_NAME', 'NEXT_PUBLIC_STORE_NAME') || 'SIMDI'
  const logoUrl = getEnvironmentValue('APP_LOGO_URL')
  const orderUrl = buildOrderUrl(order) || undefined

  const result = await sendMailWithRetry({
    to: order.email || undefined,
    cc: getEnvironmentValue('TEAM_EMAIL_1') || 'team@simdi.in',
    bcc: getEnvironmentValue('TEAM_EMAIL_2') || 'yogeshmamgain2611@gmail.com',
    subject: `Order Confirmation - Order #${order.order_number}`,
    html: renderOrderConfirmationEmail({
      order,
      appName,
      supportEmail,
      logoUrl: logoUrl || undefined,
      orderUrl,
    }),
    text: renderOrderConfirmationText({
      order,
      appName,
      supportEmail,
      logoUrl: logoUrl || undefined,
      orderUrl,
    }),
  })

  return result
}

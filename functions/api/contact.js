import { createESAHandler, error, genId, getJson, getKV, handleCors, json, putJson } from './_helpers.js'

const MESSAGES_KEY = 'contact:messages'
const CONTENT_KEY = 'site:content'
const SMTP_SETTINGS_KEY = 'notification:smtp'
const RATE_LIMIT_MS = 10 * 1000
const DEFAULT_SUBJECT_PREFIX = '金科云创官网留言'
const MAIL_GATEWAY_URL = ''
const MAIL_GATEWAY_PATH = '/smtp-notifier'
const MAIL_GATEWAY_SECRET = ''

const DEFAULT_REQUIRED = {
  name: true,
  email: true,
  phone: false,
  company: false,
  message: true
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}



export async function onRequestPost({ request, env }) {
  try {
    const kv = getKV(env)
    const body = await request.json()
    const clientIp = getClientIp(request.headers)
    const rateLimit = await checkContactRateLimit(kv, clientIp)
    if (!rateLimit.allowed) {
      return error(`提交过于频繁，请 ${rateLimit.waitSeconds} 秒后再试。`, 429)
    }

    const content = await getJson(kv, CONTENT_KEY, null)
    const fields = content?.contact?.fields || {}
    const required = getRequiredFields(fields)
    const labels = getFieldLabels(fields)
    const name = cleanText(body.name, 60)
    const email = cleanText(body.email, 120)
    const phone = cleanText(body.phone, 40)
    const company = cleanText(body.company, 120)
    const message = cleanText(body.message, 1000)

    if (required.name && name.length === 0) return error(`请填写${labels.name}`)
    if (name.length > 0 && name.length < 2) return error(`${labels.name}至少需要 2 个字符`)
    if (required.email && email.length === 0) return error(`请填写${labels.email}`)

    if (required.phone && phone.length === 0) return error(`请填写${labels.phone}`)
    if (required.company && company.length === 0) return error(`请填写${labels.company}`)
    if (required.message && message.length === 0) return error(`请填写${labels.message}`)
    if (message.length > 0 && message.length < 10) return error(`${labels.message}至少需要 10 个字符`)

    const item = {
      id: genId(),
      name,
      email,
      phone,
      company,
      message,
      ip: clientIp,
      userAgent: cleanText(request.headers.get('user-agent'), 260),
      createdAt: Date.now()
    }

    let notification = { enabled: false, sent: false }
    const smtpSettings = await getJson(kv, SMTP_SETTINGS_KEY, null)
    if (smtpSettings) {
      notification = await sendNotificationEmail({
        settings: smtpSettings,
        item,
        labels,
        siteTitle: content?.site?.title || content?.site?.brandName || '金科云创官网',
        requestUrl: request.url
      })
      if (notification.enabled) item.notification = notification
    }

    const messages = await getJson(kv, MESSAGES_KEY, [])
    messages.unshift(item)
    await putJson(kv, MESSAGES_KEY, messages.slice(0, 300))
    await putJson(kv, `contact:message:${item.id}`, item)

    return json({ success: true, message: item, notification })
  } catch (requestError) {
    return error(requestError.message, 500)
  }
}

async function checkContactRateLimit(kv, clientIp) {
  const key = `contact:rate:${safeKey(clientIp)}`
  const now = Date.now()
  const previous = Number(await kv.get(key))
  if (Number.isFinite(previous) && now - previous < RATE_LIMIT_MS) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((RATE_LIMIT_MS - (now - previous)) / 1000)
    }
  }

  await kv.put(key, String(now))
  return { allowed: true, waitSeconds: 0 }
}

async function sendNotificationEmail({ settings, item, labels, siteTitle, requestUrl }) {
  const normalizedSettings = normalizeSmtpSettings(settings, requestUrl)
  if (!normalizedSettings.enabled) return { enabled: false, sent: false }

  const recipients = parseRecipients(normalizedSettings.mailTo)
  if (recipients.length === 0) {
    return { enabled: true, sent: false, error: '邮件通知配置不完整' }
  }
  if (!normalizedSettings.gatewayUrl) {
    return { enabled: true, sent: false, error: '邮件网关地址未配置' }
  }

  const subject = `【${normalizedSettings.subjectPrefix}】${item.name || '新访客'}提交了联系信息`
  const html = buildEmailHtml({ item, labels, siteTitle, requestUrl })
  const text = buildEmailText({ item, labels, siteTitle, requestUrl })
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort('邮件发送超时'), 9000)
  const headers = { 'Content-Type': 'application/json' }
  if (normalizedSettings.gatewaySecret) headers['X-Notification-Secret'] = normalizedSettings.gatewaySecret

  try {
    const response = await fetch(normalizedSettings.gatewayUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        smtp: {
          host: normalizedSettings.smtpHost,
          port: normalizedSettings.smtpPort,
          secure: normalizedSettings.smtpSecure,
          username: normalizedSettings.smtpUser,
          password: normalizedSettings.smtpPassword
        },
        message: {
          from: normalizedSettings.mailFrom,
          to: recipients,
          replyTo: isEmailAddress(item.email) ? item.email : normalizedSettings.mailFrom,
          subject,
          html,
          text
        }
      }),
      signal: controller.signal
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || result?.success === false) {
      throw new Error(result.error || `邮件网关返回 ${response.status}`)
    }
    return { enabled: true, sent: true, sentAt: Date.now() }
  } catch (sendError) {
    return {
      enabled: true,
      sent: false,
      error: sendError instanceof Error ? sendError.message : '邮件发送失败'
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

function normalizeSmtpSettings(settings = {}, requestUrl = '') {
  const smtpPort = normalizePort(settings.smtpPort)
  const smtpHost = cleanText(settings.smtpHost, 160)
  const smtpUser = cleanText(settings.smtpUser, 160)
  const smtpPassword = cleanText(settings.smtpPassword, 180)
  const mailTo = cleanText(settings.mailTo, 500)

  return {
    enabled: Boolean(mailTo && smtpHost && smtpUser && smtpPassword),
    gatewayUrl: getMailGatewayUrl(requestUrl),
    gatewaySecret: cleanText(MAIL_GATEWAY_SECRET, 180),
    smtpHost,
    smtpPort,
    smtpSecure: smtpPort === 465,
    smtpUser,
    smtpPassword,
    mailFrom: smtpUser,
    mailTo,
    subjectPrefix: DEFAULT_SUBJECT_PREFIX
  }
}

function getMailGatewayUrl(requestUrl) {
  const fixedUrl = cleanText(MAIL_GATEWAY_URL, 260)
  if (fixedUrl) return fixedUrl

  try {
    return new URL(MAIL_GATEWAY_PATH, requestUrl).toString()
  } catch {
    return cleanText(MAIL_GATEWAY_PATH, 260)
  }
}

function normalizePort(value) {
  const port = Number(value)
  if (!Number.isFinite(port) || port <= 0 || port > 65535) return 465
  return Math.round(port)
}

function parseRecipients(value) {
  return String(value || '')
    .split(/[,;，；\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function isEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function buildEmailHtml({ item, labels, siteTitle, requestUrl }) {
  const rows = [
    [labels.name, item.name],
    [labels.email, item.email],
    [labels.phone, item.phone],
    [labels.company, item.company],
    [labels.message, item.message],
    ['来源 IP', item.ip],
    ['提交时间', formatDate(item.createdAt)],
    ['页面地址', requestUrl]
  ].filter(([, value]) => String(value || '').trim())

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(siteTitle)}联系表单通知</title>
</head>
<body style="margin:0;background:#f3f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',Arial,sans-serif;color:#111827;">
  <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
    <div style="overflow:hidden;border-radius:14px;background:#ffffff;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(15,23,42,.08);">
      <div style="background:#155eef;color:#fff;padding:24px 28px;">
        <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.85;">Contact Notice</div>
        <h1 style="margin:8px 0 0;font-size:24px;line-height:1.35;font-weight:700;">${escapeHtml(siteTitle)}收到新的联系信息</h1>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 18px;color:#4b5563;line-height:1.7;">请尽快联系这位访客，以下是表单提交的详细内容。</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
          ${rows.map(([label, value]) => `
          <tr>
            <td style="width:110px;padding:13px 0;border-top:1px solid #eef2f7;color:#6b7280;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:13px 0;border-top:1px solid #eef2f7;color:#111827;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(value)}</td>
          </tr>`).join('')}
        </table>
      </div>
      <div style="background:#f9fafb;padding:16px 28px;color:#6b7280;font-size:12px;line-height:1.6;">
        此邮件由官网联系表单自动发送，请勿直接泄露访客信息。
      </div>
    </div>
  </div>
</body>
</html>`
}

function buildEmailText({ item, labels, siteTitle, requestUrl }) {
  return [
    `${siteTitle}收到新的联系信息`,
    '',
    `${labels.name}: ${item.name}`,
    `${labels.email}: ${item.email}`,
    `${labels.phone}: ${item.phone}`,
    `${labels.company}: ${item.company}`,
    `${labels.message}: ${item.message}`,
    `来源 IP: ${item.ip}`,
    `提交时间: ${formatDate(item.createdAt)}`,
    `页面地址: ${requestUrl}`
  ].join('\n')
}

function getClientIp(headers) {
  const directIp = firstHeader(headers, [
    'cf-connecting-ip',
    'true-client-ip',
    'x-real-ip',
    'x-client-ip',
    'fastly-client-ip',
    'ali-cdn-real-ip',
    'x-forwarded-for'
  ])

  return cleanText(String(directIp || '').split(',')[0], 80) || 'unknown'
}

function firstHeader(headers, names) {
  for (const name of names) {
    const value = headers.get(name)
    if (value) return value
  }
  return ''
}

function safeKey(value) {
  return cleanText(value, 120).replace(/[^a-zA-Z0-9._-]/g, '_') || 'unknown'
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getRequiredFields(fields) {
  return {
    name: fields.nameRequired === undefined ? DEFAULT_REQUIRED.name : fields.nameRequired === true,
    email: fields.emailRequired === undefined ? DEFAULT_REQUIRED.email : fields.emailRequired === true,
    phone: fields.phoneRequired === undefined ? DEFAULT_REQUIRED.phone : fields.phoneRequired === true,
    company: fields.companyRequired === undefined ? DEFAULT_REQUIRED.company : fields.companyRequired === true,
    message: fields.messageRequired === undefined ? DEFAULT_REQUIRED.message : fields.messageRequired === true
  }
}

function getFieldLabels(fields) {
  return {
    name: cleanLabel(fields.name, '姓名'),
    email: cleanLabel(fields.email, '邮箱'),
    phone: cleanLabel(fields.phone, '电话'),
    company: cleanLabel(fields.company, '公司'),
    message: cleanLabel(fields.message, '需求说明')
  }
}

function cleanLabel(value, fallback) {
  return String(value || fallback).replace(/（选填）|\(选填\)/g, '').trim() || fallback
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestPost, onRequestOptions })

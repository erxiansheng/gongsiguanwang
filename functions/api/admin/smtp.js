import { createESAHandler, error, getJson, getKV, handleCors, json, putJson, requireAuth } from '../_helpers.js'

const SMTP_SETTINGS_KEY = 'notification:smtp'

const DEFAULT_SMTP_SETTINGS = {
  smtpHost: '',
  smtpPort: 465,
  smtpUser: '',
  smtpPassword: '',
  mailTo: ''
}

export async function onRequestGet({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const settings = await getJson(kv, SMTP_SETTINGS_KEY, DEFAULT_SMTP_SETTINGS)
    return json({ settings: publicSettings(normalizeSettings(settings)) })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

export async function onRequestPut({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const body = await request.json()
    const existing = normalizeSettings(await getJson(kv, SMTP_SETTINGS_KEY, DEFAULT_SMTP_SETTINGS))
    const updated = normalizeSettings({
      ...existing,
      ...body,
      smtpPassword: cleanText(body.smtpPassword, 180) || existing.smtpPassword
    })

    if (hasVisibleConfig(updated)) {
      if (!updated.smtpHost) return error('请填写 SMTP 服务器')
      if (!updated.smtpUser) return error('请填写 SMTP 用户名')
      if (!updated.smtpPassword) return error('请填写 SMTP 密码')
      if (parseRecipients(updated.mailTo).length === 0) return error('请填写通知邮箱')
    }

    await putJson(kv, SMTP_SETTINGS_KEY, { ...updated, updatedAt: Date.now() })
    return json({ settings: publicSettings(updated) })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

function normalizeSettings(settings = {}) {
  return {
    smtpHost: cleanText(settings.smtpHost, 160),
    smtpPort: normalizePort(settings.smtpPort),
    smtpUser: cleanText(settings.smtpUser, 160),
    smtpPassword: cleanText(settings.smtpPassword, 180),
    mailTo: cleanText(settings.mailTo, 500)
  }
}

function publicSettings(settings) {
  const { smtpPassword, ...visible } = settings
  return {
    ...visible,
    smtpPasswordSet: Boolean(smtpPassword)
  }
}

function hasVisibleConfig(settings) {
  return Boolean(settings.mailTo || settings.smtpHost || settings.smtpUser)
}

function normalizePort(value) {
  const port = Number(value)
  if (!Number.isFinite(port) || port <= 0 || port > 65535) return DEFAULT_SMTP_SETTINGS.smtpPort
  return Math.round(port)
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function parseRecipients(value) {
  return String(value || '')
    .split(/[,;，；\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestGet, onRequestPut, onRequestOptions })

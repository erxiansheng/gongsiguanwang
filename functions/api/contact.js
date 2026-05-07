import { createESAHandler, error, genId, getJson, getKV, handleCors, json, putJson } from './_helpers.js'

const MESSAGES_KEY = 'contact:messages'
const CONTENT_KEY = 'site:content'

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

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function onRequestPost({ request, env }) {
  try {
    const kv = getKV(env)
    const body = await request.json()
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
    if (email.length > 0 && !isEmail(email)) return error(`请填写有效${labels.email}`)
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
      createdAt: Date.now()
    }
    const messages = await getJson(kv, MESSAGES_KEY, [])
    messages.unshift(item)
    await putJson(kv, MESSAGES_KEY, messages.slice(0, 300))
    await putJson(kv, `contact:message:${item.id}`, item)

    return json({ success: true, message: item })
  } catch (requestError) {
    return error(requestError.message, 500)
  }
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
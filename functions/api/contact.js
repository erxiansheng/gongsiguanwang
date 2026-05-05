import { createESAHandler, error, genId, getJson, getKV, handleCors, json, putJson } from './_helpers.js'

const MESSAGES_KEY = 'contact:messages'

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
    const name = cleanText(body.name, 60)
    const email = cleanText(body.email, 120)
    const phone = cleanText(body.phone, 40)
    const company = cleanText(body.company, 120)
    const message = cleanText(body.message, 1000)

    if (name.length < 2) return error('请填写姓名')
    if (!isEmail(email)) return error('请填写有效邮箱')
    if (message.length < 10) return error('请补充需求说明')

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

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestPost, onRequestOptions })
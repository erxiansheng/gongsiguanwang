import { createESAHandler, error, getJson, getKV, handleCors, json, putJson, requireAuth } from '../_helpers.js'

const MESSAGES_KEY = 'contact:messages'

export async function onRequestGet({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const messages = await getJson(kv, MESSAGES_KEY, [])
    return json({ messages })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const body = await request.json()
    if (!body.id) return error('缺少留言编号')
    const messages = await getJson(kv, MESSAGES_KEY, [])
    await putJson(kv, MESSAGES_KEY, messages.filter((item) => item.id !== body.id))
    await kv.delete(`contact:message:${body.id}`)
    return json({ success: true })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestGet, onRequestDelete, onRequestOptions })
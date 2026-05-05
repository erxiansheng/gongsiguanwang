import { createESAHandler, error, getJson, getKV, handleCors, json, putJson, requireAuth } from '../_helpers.js'

const CONTENT_KEY = 'site:content'

export async function onRequestGet({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const content = await getJson(kv, CONTENT_KEY, null)
    return json({ content })
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
    if (!body || typeof body.content !== 'object' || Array.isArray(body.content)) {
      return error('内容格式不正确', 400)
    }

    const updated = {
      ...body.content,
      updatedAt: Date.now()
    }
    await putJson(kv, CONTENT_KEY, updated)
    return json({ content: updated })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestGet, onRequestPut, onRequestOptions })
import { createESAHandler, error, getJson, getKV, handleCors, json } from './_helpers.js'

const CONTENT_KEY = 'site:content'

export async function onRequestGet({ env }) {
  try {
    const kv = getKV(env)
    const content = await getJson(kv, CONTENT_KEY, null)
    return json({ content })
  } catch (requestError) {
    return error(requestError.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestGet, onRequestOptions })
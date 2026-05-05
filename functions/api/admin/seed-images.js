import { createESAHandler, error, getKV, handleCors, json, requireAuth } from '../_helpers.js'
import { fetchAndStoreImage } from '../_assets.js'

const IMAGE_KEY_PATTERN = /(image|logo|avatar|featuredImage|heroImage|approachImage|ctaImage|faviconUrl)$/i
const REMOTE_IMAGE_PATTERN = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?.*)?$/i

export async function onRequestPost({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const body = await request.json()
    if (!body || typeof body.content !== 'object') return error('缺少站点内容')

    const limit = Math.max(1, Math.min(Number(body.limit || 4), 6))
    const content = JSON.parse(JSON.stringify(body.content))
    const candidates = collectRemoteImages(content).slice(0, limit)
    const processed = []
    const failed = []

    for (const item of candidates) {
      try {
        const stored = await fetchAndStoreImage(kv, request, item.url)
        replaceValueAtPath(content, item.path, stored.url)
        processed.push({ source: item.url, url: stored.url })
      } catch (storeError) {
        failed.push({ source: item.url, error: storeError.message })
      }
    }

    const remaining = collectRemoteImages(content).length
    return json({ content, processed, failed, remaining })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

function collectRemoteImages(value, path = [], results = []) {
  if (typeof value === 'string') {
    const key = String(path[path.length - 1] || '')
    if (IMAGE_KEY_PATTERN.test(key) && REMOTE_IMAGE_PATTERN.test(value)) {
      results.push({ path, url: value })
    }
    return results
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectRemoteImages(item, [...path, index], results))
    return results
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => collectRemoteImages(item, [...path, key], results))
  }

  return results
}

function replaceValueAtPath(target, path, value) {
  let current = target
  for (let index = 0; index < path.length - 1; index++) {
    current = current[path[index]]
  }
  current[path[path.length - 1]] = value
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestPost, onRequestOptions })
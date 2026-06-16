const KV_BINDING_NAMES = ['site_kv', 'SITE_KV', 'blog_data']
const DEFAULT_TOKEN_SECRET = 'jkyc-admin-secret-change-me'

function createAliyunKVWrapper(namespace) {
  const kv = new EdgeKV({ namespace })
  return {
    async get(key, options) {
      try {
        const value = await kv.get(key, { type: options?.type || 'text' })
        if (value === undefined || value === null) return null
        if (options?.type === 'json' && typeof value === 'string') return JSON.parse(value)
        return value
      } catch {
        return null
      }
    },
    async put(key, value) {
      return kv.put(key, typeof value === 'string' ? value : JSON.stringify(value))
    },
    async delete(key) {
      try {
        return await kv.delete(key)
      } catch {
        return null
      }
    },
    async list() {
      return { complete: true, cursor: null, keys: [] }
    }
  }
}

export function getKV(env = {}) {
  for (const name of KV_BINDING_NAMES) {
    if (env && env[name]) return env[name]
  }

  if (typeof site_kv !== 'undefined') return site_kv
  if (typeof SITE_KV !== 'undefined') return SITE_KV
  if (typeof blog_data !== 'undefined') return blog_data

  if (typeof EdgeKV !== 'undefined') {
    return createAliyunKVWrapper('blog_data')
  }

  throw new Error('未检测到 KV 绑定，请在 EdgeOne Pages 中绑定变量名 site_kv。')
}

export async function getJson(kv, key, fallback = null) {
  const value = await kv.get(key, { type: 'json' })
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return JSON.parse(value)
  return value
}

export async function putJson(kv, key, value) {
  await kv.put(key, JSON.stringify(value))
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders({ 'Content-Type': 'application/json; charset=UTF-8' })
  })
}

export function error(message, status = 400) {
  return json({ error: message }, status)
}

export function handleCors() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  })
}

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extra
  }
}

function getSecret(env = {}) {
  return env.ADMIN_TOKEN_SECRET || DEFAULT_TOKEN_SECRET
}

export async function createToken(payload, env = {}) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 3600 * 1000 }))
  const data = `${header}.${body}`
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(getSecret(env)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`
}

export async function verifyToken(token, env = {}) {
  if (!token) return null
  try {
    const [header, body, signature] = token.split('.')
    const data = `${header}.${body}`
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(getSecret(env)), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const signatureBytes = Uint8Array.from(atob(signature), char => char.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data))
    if (!valid) return null
    const payload = JSON.parse(atob(body))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function requireAuth(request, env = {}) {
  const auth = request.headers.get('Authorization')
  const token = auth?.replace('Bearer ', '')
  const payload = await verifyToken(token, env)
  if (!payload) throw new Error('Unauthorized')
  return payload
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function createESAHandler(handlers) {
  return {
    async fetch(request, env) {
      const method = request.method.toUpperCase()
      if (method === 'OPTIONS' && handlers.onRequestOptions) {
        return handlers.onRequestOptions({ request, env })
      }

      const url = new URL(request.url)
      const params = extractParams(url.pathname, handlers._pattern || '')
      const context = { request, env, params }
      const methodMap = {
        GET: 'onRequestGet',
        POST: 'onRequestPost',
        PUT: 'onRequestPut',
        DELETE: 'onRequestDelete',
        PATCH: 'onRequestPatch'
      }
      const handlerName = methodMap[method]

      if (handlerName && handlers[handlerName]) {
        return handlers[handlerName](context)
      }

      return error('请求方法不允许', 405)
    }
  }
}

function extractParams(pathname, pattern) {
  if (!pattern) return {}
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  const params = {}
  for (let index = 0; index < patternParts.length; index++) {
    const match = patternParts[index].match(/^\[(.+)\]$/)
    if (match && pathParts[index]) {
      params[match[1]] = decodeURIComponent(pathParts[index])
    }
  }
  return params
}

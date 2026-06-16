import { createESAHandler, error, getJson, getKV, handleCors, json, putJson } from './_helpers.js'

const TOTAL_VIEWS_KEY = 'site_views:total'
const VISIT_LOGS_KEY = 'site_visits:logs'
const REGION_STATS_KEY = 'site_visits:regions'
const IP_GEO_CACHE_PREFIX = 'site_visits:ipgeo:'
const MAX_LOGS = 300
const MAX_REGION_STATS = 200
const IP_LOOKUP_TIMEOUT_MS = 1800

const IP_GEO_PROVIDERS = [
  {
    name: 'ip9',
    url: (ip) => `https://ip9.com.cn/get?ip=${encodeURIComponent(ip)}`,
    parse: parseIp9Response
  },
  {
    name: 'pconline',
    url: (ip) => `https://whois.pconline.com.cn/ipJson.jsp?json=true&ip=${encodeURIComponent(ip)}`,
    parse: parsePconlineResponse
  },
  {
    name: 'shturl',
    url: (ip) => `https://shturl.cc/R0/api/IPdata?ip=${encodeURIComponent(ip)}`,
    parse: parseGenericIpResponse
  },
  {
    name: 'useragentinfo',
    url: (ip) => `https://ip.useragentinfo.com/json?ip=${encodeURIComponent(ip)}`,
    parse: parseGenericIpResponse
  }
]

export async function onRequestPost({ request, env }) {
  try {
    const kv = getKV(env)
    const body = await request.json().catch(() => ({}))
    const now = Date.now()
    const today = new Date(now).toISOString().slice(0, 10)
    const dailyKey = `site_views:daily:${today}`
    const ip = getClientIp(request)
    const geo = await getGeoForVisit({ request, kv, ip })
    const visit = {
      id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      visitorId: sanitize(body.visitorId, 96),
      ip,
      location: geo.location,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      path: sanitize(body.path, 160) || '/',
      referrer: sanitize(body.referrer, 220),
      userAgent: sanitize(body.userAgent || request.headers.get('user-agent'), 260),
      createdAt: now
    }

    const [totalStr, dailyStr, logs, regionStats] = await Promise.all([
      kv.get(TOTAL_VIEWS_KEY),
      kv.get(dailyKey),
      getJson(kv, VISIT_LOGS_KEY, []),
      getJson(kv, REGION_STATS_KEY, {})
    ])

    const totalViews = Number.parseInt(totalStr || '0', 10) + 1
    const todayViews = Number.parseInt(dailyStr || '0', 10) + 1
    const nextLogs = [visit, ...(Array.isArray(logs) ? logs : [])].slice(0, MAX_LOGS)
    const nextRegionStats = updateRegionStats(regionStats, visit)

    await Promise.all([
      kv.put(TOTAL_VIEWS_KEY, String(totalViews)),
      kv.put(dailyKey, String(todayViews)),
      putJson(kv, VISIT_LOGS_KEY, nextLogs),
      putJson(kv, REGION_STATS_KEY, nextRegionStats)
    ])

    return json({ success: true })
  } catch (visitError) {
    return error(visitError.message || '访问记录失败', 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

function updateRegionStats(stats, visit) {
  const record = stats && typeof stats === 'object' && !Array.isArray(stats) ? stats : {}
  const key = visit.location || '未知地区'
  const previous = record[key] || {}
  const next = {
    ...record,
    [key]: {
      location: key,
      country: visit.country,
      region: visit.region,
      city: visit.city,
      count: Number(previous.count || 0) + 1,
      latestIp: visit.ip,
      latestPath: visit.path,
      latestAt: visit.createdAt
    }
  }

  return Object.fromEntries(
    Object.entries(next)
      .sort(([, a], [, b]) => Number(b.count || 0) - Number(a.count || 0))
      .slice(0, MAX_REGION_STATS)
  )
}

async function getGeoForVisit({ request, kv, ip }) {
  const edgeGeo = getGeoFromRequest(request)
  if (isDetailedGeo(edgeGeo)) return edgeGeo

  if (!isLookupableIp(ip)) return isKnownGeo(edgeGeo) ? edgeGeo : unknownGeo()

  const cacheKey = `${IP_GEO_CACHE_PREFIX}${safeCacheKey(ip)}`
  try {
    const cached = await getJson(kv, cacheKey, null)
    const cachedGeo = normalizeGeo(cached)
    if (isKnownGeo(cachedGeo)) return cachedGeo
  } catch {
    // Cache misses or malformed old values should never block visit tracking.
  }

  const lookedUpGeo = await lookupGeoByIp(ip)
  if (isKnownGeo(lookedUpGeo)) {
    try {
      await putJson(kv, cacheKey, lookedUpGeo)
    } catch {
      // The visit itself is more important than the optional geo cache.
    }
    return lookedUpGeo
  }

  return isKnownGeo(edgeGeo) ? edgeGeo : unknownGeo()
}

function getClientIp(request) {
  const headers = request.headers
  const candidates = [
    request?.eo?.clientIp,
    request?.eo?.clientIP,
    ...[
      'eo-client-ip',
      'eo-connecting-ip',
      'eo-real-ip',
      'cf-connecting-ip',
      'true-client-ip',
      'x-real-ip',
      'x-client-ip',
      'fastly-client-ip',
      'ali-cdn-real-ip',
      'x-forwarded-for',
      'forwarded'
    ].map((name) => headers.get(name))
  ]

  for (const candidate of candidates) {
    const ip = firstIpFromValue(candidate)
    if (ip) return ip
  }

  return 'unknown'
}

function getGeoFromRequest(request) {
  const eoGeo = request?.eo?.geo || {}
  const country = firstValue([
    eoGeo.countryName,
    eoGeo.countryCodeAlpha2,
    firstHeader(request.headers, [
      'eo-client-ipcountry',
      'eo-client-country',
      'eo-country',
      'ali-ip-country',
      'x-edge-ip-country',
      'cf-ipcountry',
      'x-vercel-ip-country',
      'x-country-code',
      'cloudfront-viewer-country',
      'x-appengine-country'
    ])
  ])
  const region = firstValue([
    eoGeo.regionName,
    firstHeader(request.headers, [
      'eo-client-region',
      'eo-region',
      'ali-ip-region',
      'x-edge-ip-region',
      'cf-region',
      'x-vercel-ip-country-region',
      'x-region',
      'cloudfront-viewer-country-region',
      'x-appengine-region'
    ])
  ])
  const city = firstValue([
    eoGeo.cityName,
    firstHeader(request.headers, [
      'eo-client-city',
      'eo-city',
      'ali-ip-city',
      'x-edge-ip-city',
      'cf-ipcity',
      'x-vercel-ip-city',
      'x-city',
      'cloudfront-viewer-city',
      'x-appengine-city'
    ])
  ])

  return normalizeGeo({ country, region, city })
}

async function lookupGeoByIp(ip) {
  for (const provider of IP_GEO_PROVIDERS) {
    let timeoutId
    try {
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), IP_LOOKUP_TIMEOUT_MS)
      const response = await fetch(provider.url(ip), {
        headers: { Accept: 'application/json,text/plain,*/*' },
        signal: controller.signal
      })
      if (!response.ok) continue

      const payload = parseLooseJson(await response.text())
      const geo = provider.parse(payload)
      if (isKnownGeo(geo)) return geo
    } catch {
      // Rate limits, network errors, and malformed responses fall through to the next provider.
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  return unknownGeo()
}

function parseIp9Response(payload) {
  if (!payload || (payload.ret && Number(payload.ret) !== 200)) return unknownGeo()
  const data = payload.data || payload
  return normalizeGeo({
    country: data.country,
    region: data.prov || data.province || data.region,
    city: data.city,
    isp: data.isp,
    location: data.addr || data.location
  })
}

function parsePconlineResponse(payload) {
  if (!payload || payload.err) return unknownGeo()
  return normalizeGeo({
    country: payload.country,
    region: payload.pro || payload.prov || payload.province || payload.region,
    city: payload.city,
    isp: payload.isp,
    location: payload.addr || payload.location
  })
}

function parseGenericIpResponse(payload) {
  if (!payload) return unknownGeo()
  const data = payload.data || payload.result || payload
  if (data.success === false || data.status === 'fail' || data.status === 'error') return unknownGeo()

  return normalizeGeo({
    country: data.country || data.country_name || data.countryName,
    region: data.pro || data.prov || data.province || data.region || data.region_name || data.regionName,
    city: data.city || data.city_name || data.cityName,
    isp: data.isp || data.org || data.operator,
    location: data.addr || data.address || data.location
  })
}

function parseLooseJson(text) {
  const value = String(text || '').replace(/^\uFEFF/, '').trim()
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    const jsonpMatch =
      value.match(/IPCallBack\(([\s\S]*?)\)\s*;?\s*\}?$/) ||
      value.match(/^[\w$.]+\(([\s\S]*?)\)\s*;?$/)
    if (!jsonpMatch) return null
    try {
      return JSON.parse(jsonpMatch[1])
    } catch {
      return null
    }
  }
}

function normalizeGeo(geo = {}) {
  const country = cleanGeoPart(geo.country)
  const region = cleanGeoPart(geo.region)
  const city = cleanGeoPart(geo.city)
  const fallbackLocation = sanitize(geo.location, 160)
  const parts = uniqueGeoParts([country, region, city])

  return {
    country,
    region,
    city,
    isp: sanitize(geo.isp, 80),
    location: parts.length ? parts.join(' / ') : fallbackLocation || '未知地区'
  }
}

function unknownGeo() {
  return {
    country: '',
    region: '',
    city: '',
    isp: '',
    location: '未知地区'
  }
}

function isKnownGeo(geo) {
  return Boolean(geo && geo.location && geo.location !== '未知地区')
}

function isDetailedGeo(geo) {
  return isKnownGeo(geo) && Boolean(geo.region || geo.city)
}

function firstValue(values) {
  for (const value of values) {
    const cleaned = cleanGeoPart(value)
    if (cleaned) return cleaned
  }
  return ''
}

function firstIpFromValue(value) {
  return String(value || '')
    .split(',')
    .map((item) => normalizeIp(item))
    .find(Boolean) || ''
}

function normalizeIp(value) {
  let ip = String(value || '').trim()
  if (!ip || ip.toLowerCase() === 'unknown') return ''

  ip = ip.replace(/^for=/i, '').replace(/^"|"$/g, '')
  ip = ip.split(';')[0].trim()
  const bracketMatch = ip.match(/^\[([^\]]+)\](?::\d+)?$/)
  if (bracketMatch) ip = bracketMatch[1]
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.replace(/:\d+$/, '')

  return isValidIp(ip) ? ip : ''
}

function isValidIp(ip) {
  return isValidIpv4(ip) || isValidIpv6(ip)
}

function isValidIpv4(ip) {
  const parts = String(ip).split('.')
  return parts.length === 4 && parts.every((part) => {
    if (!/^\d+$/.test(part)) return false
    const value = Number(part)
    return value >= 0 && value <= 255
  })
}

function isValidIpv6(ip) {
  return /^[0-9a-f:]+$/i.test(String(ip)) && String(ip).includes(':') && String(ip).length >= 3
}

function isLookupableIp(ip) {
  if (!isValidIp(ip)) return false
  if (isValidIpv4(ip)) return !isPrivateIpv4(ip)

  const lower = ip.toLowerCase()
  return !(
    lower === '::1' ||
    lower.startsWith('fe80:') ||
    lower.startsWith('fc') ||
    lower.startsWith('fd')
  )
}

function isPrivateIpv4(ip) {
  const [a, b] = ip.split('.').map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  )
}

function cleanGeoPart(value) {
  const part = sanitize(decodeHeaderValue(value), 80)
  if (!part || part === '?' || part.toUpperCase() === 'ZZ') return ''
  return part
}

function uniqueGeoParts(parts) {
  const seen = new Set()
  return parts.filter((part) => {
    const key = part.replace(/[省市自治区特别行政区\s]/g, '').toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function safeCacheKey(value) {
  return sanitize(value, 120).replace(/[^a-zA-Z0-9:._-]/g, '_')
}

function firstHeader(headers, names) {
  for (const name of names) {
    const value = headers.get(name)
    if (value) return value
  }
  return ''
}

function decodeHeaderValue(value) {
  if (!value) return ''
  try {
    return decodeURIComponent(String(value))
  } catch {
    return String(value)
  }
}

function sanitize(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export default createESAHandler({ onRequestPost, onRequestOptions })

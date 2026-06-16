import { json, error, handleCors, requireAuth, getKV, getJson } from '../_helpers.js'
import { createESAHandler } from '../_helpers.js'

export async function onRequestGet({ request }) {
  try {
    await requireAuth(request)
    const kv = getKV()
    const today = new Date().toISOString().slice(0, 10)

    // 并行读取所有数据
    const [
      indexStr,
      catsStr,
      imagesStr,
      dailyViewsStr,
      readsStr,
      commentsIndexStr,
      totalVisitsStr,
      todayVisitsStr,
      visitLogs,
      regionStats
    ] = await Promise.all([
      kv.get('posts:index'),
      kv.get('categories'),
      kv.get('images:index'),
      kv.get(`daily_views:${today}`),
      kv.get(`daily_reads:${today}`),
      kv.get('comments:index'),
      kv.get('site_views:total'),
      kv.get(`site_views:daily:${today}`),
      getJson(kv, 'site_visits:logs', []),
      getJson(kv, 'site_visits:regions', {})
    ])

    const posts = indexStr ? JSON.parse(indexStr) : []
    const categories = catsStr ? JSON.parse(catsStr) : []
    const images = imagesStr ? JSON.parse(imagesStr) : []
    const todayViews = parseInt(dailyViewsStr || '0')
    const todayReads = readsStr ? JSON.parse(readsStr).length : 0
    const commentsCount = commentsIndexStr ? JSON.parse(commentsIndexStr).length : 0
    const regionVisits = Object.values(regionStats || {})
      .sort(compareRegionVisits)
      .slice(0, 30)

    return json({
      posts: posts.length,
      categories: categories.length,
      images: images.length,
      todayViews,
      todayReads,
      comments: commentsCount,
      totalVisits: parseInt(totalVisitsStr || '0'),
      todayVisits: parseInt(todayVisitsStr || '0'),
      regionVisits,
      visitLogs: Array.isArray(visitLogs) ? visitLogs.slice(0, 30) : []
    })
  } catch (e) {
    if (e.message === 'Unauthorized') return error('未授权', 401)
    return error(e.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

function compareRegionVisits(a, b) {
  const aKnown = isKnownRegionVisit(a)
  const bKnown = isKnownRegionVisit(b)
  if (aKnown !== bKnown) return aKnown ? -1 : 1
  return Number(b.count || 0) - Number(a.count || 0)
}

function isKnownRegionVisit(visit) {
  return Boolean(
    visit &&
    visit.location &&
    visit.location !== '未知地区' &&
    visit.latestIp &&
    visit.latestIp !== 'unknown'
  )
}

export default createESAHandler({ onRequestGet, onRequestOptions })

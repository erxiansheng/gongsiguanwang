import { json, error, handleCors, getKV } from './_helpers.js'
import { createESAHandler } from './_helpers.js'

export async function onRequestGet() {
  try {
    const kv = getKV()
    const settingsStr = await kv.get('site:settings')
    const settings = settingsStr ? JSON.parse(settingsStr) : {
      siteName: '澄造数字', subtitle: '品牌与数字体验工作室', description: '记录项目与团队动态', about: ''
    }
    const { passwordHash, ...publicSettings } = settings
    return json(publicSettings)
  } catch (e) {
    return error(e.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestGet, onRequestOptions })
import { json, error, handleCors, getKV } from './_helpers.js'
import { createESAHandler } from './_helpers.js'

export async function onRequestGet() {
  try {
    const kv = getKV()
    const settingsStr = await kv.get('site:settings')
    const settings = settingsStr ? JSON.parse(settingsStr) : {
      siteName: '金科云创车载测试',
      subtitle: '专业车载测试培训',
      description: '更专业 · 更负责 · 好就业 · 好口碑 帮助每一个学员完成就业',
      about: '金科云创致力于帮助0基础学员转行为车企工程师。'
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

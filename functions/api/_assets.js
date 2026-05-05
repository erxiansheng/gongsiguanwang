import { genId, getJson, putJson } from './_helpers.js'

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const MAX_REQUEST_FILE_SIZE = 900 * 1024
export const IMAGE_INDEX_KEY = 'images:index'

const EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/bmp': 'bmp'
}

export function getPublicUploadUrl(request, filename) {
  return new URL(`/uploads/${filename}`, request.url).href
}

export function getExtension(filename = '', contentType = '') {
  const cleanName = filename.split('?')[0]
  const ext = cleanName.includes('.') ? cleanName.split('.').pop().toLowerCase() : ''
  return ext || EXTENSION_BY_TYPE[contentType] || 'bin'
}

export function isAllowedImageType(extension) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'].includes(extension)
}

export function createStoredFilename(originalName, contentType) {
  const extension = getExtension(originalName, contentType)
  return `${Date.now()}-${genId()}.${extension}`
}

export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  const batchSize = 32768
  const parts = []
  for (let index = 0; index < bytes.byteLength; index += batchSize) {
    const slice = bytes.subarray(index, Math.min(index + batchSize, bytes.byteLength))
    parts.push(String.fromCharCode.apply(null, slice))
  }
  return btoa(parts.join(''))
}

export function base64ToUint8Array(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export async function saveImageToKV(kv, { filename, originalName, contentType, base64, size, sourceUrl }) {
  if (!base64) throw new Error('缺少图片数据')
  if (size > MAX_IMAGE_SIZE) throw new Error('单个图片不能超过 10M')

  const meta = {
    contentType: contentType || 'image/png',
    size,
    originalName: originalName || filename,
    sourceUrl: sourceUrl || '',
    createdAt: Date.now()
  }

  await kv.put(`image:${filename}`, base64)
  await putJson(kv, `image_meta:${filename}`, meta)

  const index = await getJson(kv, IMAGE_INDEX_KEY, [])
  const nextIndex = [
    { filename, contentType: meta.contentType, size, originalName: meta.originalName, sourceUrl: meta.sourceUrl, createdAt: meta.createdAt },
    ...index.filter((item) => item.filename !== filename)
  ]
  await putJson(kv, IMAGE_INDEX_KEY, nextIndex.slice(0, 500))

  return meta
}

export async function fetchAndStoreImage(kv, request, url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`图片下载失败：${url}`)

  const contentType = response.headers.get('Content-Type') || 'image/png'
  if (!contentType.startsWith('image/')) throw new Error('远程地址不是图片')

  const contentLength = Number(response.headers.get('Content-Length') || '0')
  if (contentLength > MAX_IMAGE_SIZE) throw new Error('远程图片超过 10M')

  const buffer = await response.arrayBuffer()
  if (buffer.byteLength > MAX_IMAGE_SIZE) throw new Error('远程图片超过 10M')

  const urlPath = new URL(url).pathname
  const filename = createStoredFilename(urlPath, contentType)
  const base64 = arrayBufferToBase64(buffer)
  await saveImageToKV(kv, {
    filename,
    originalName: urlPath.split('/').pop() || filename,
    contentType,
    base64,
    size: buffer.byteLength,
    sourceUrl: url
  })

  return {
    filename,
    url: getPublicUploadUrl(request, filename)
  }
}
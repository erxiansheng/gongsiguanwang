import { createESAHandler, error, getJson, getKV, handleCors, json, putJson, requireAuth } from '../_helpers.js'
import {
  arrayBufferToBase64,
  base64ToUint8Array,
  createStoredFilename,
  getExtension,
  getPublicUploadUrl,
  isAllowedImageType,
  MAX_IMAGE_SIZE,
  MAX_REQUEST_FILE_SIZE,
  saveImageToKV
} from '../_assets.js'

const UPLOAD_PREFIX = 'upload:image:'

export async function onRequestPost({ request, env }) {
  try {
    await requireAuth(request, env)
    const kv = getKV(env)
    const formData = await request.formData()
    const chunk = formData.get('chunk')

    if (chunk) {
      return handleChunkUpload({ kv, request, formData, chunk })
    }

    return handleDirectUpload({ kv, request, formData })
  } catch (requestError) {
    if (requestError.message === 'Unauthorized') return error('未授权', 401)
    return error(requestError.message, 500)
  }
}

async function handleDirectUpload({ kv, request, formData }) {
  const file = formData.get('file')
  if (!file) return error('没有文件')
  if (file.size > MAX_IMAGE_SIZE) return error('单个图片不能超过 10M')
  if (file.size > MAX_REQUEST_FILE_SIZE) return error('请使用分片上传')

  const extension = getExtension(file.name, file.type)
  if (!isAllowedImageType(extension)) return error('不支持的图片格式')

  const buffer = await file.arrayBuffer()
  const filename = createStoredFilename(file.name, file.type)
  const base64 = arrayBufferToBase64(buffer)
  await saveImageToKV(kv, {
    filename,
    originalName: file.name,
    contentType: file.type,
    base64,
    size: file.size
  })

  return json({ url: getPublicUploadUrl(request, filename), filename })
}

async function handleChunkUpload({ kv, request, formData, chunk }) {
  const sessionId = String(formData.get('sessionId') || '')
  const originalName = String(formData.get('filename') || chunk.name || '')
  const contentType = String(formData.get('contentType') || chunk.type || 'image/png')
  const totalSize = Number(formData.get('totalSize') || 0)
  const index = Number(formData.get('index') || 0)
  const totalChunks = Number(formData.get('totalChunks') || 1)
  const complete = String(formData.get('complete') || 'false') === 'true'

  if (!sessionId) return error('缺少上传会话')
  if (!Number.isFinite(index) || !Number.isFinite(totalChunks) || index < 0 || totalChunks < 1) return error('分片参数不正确')
  if (!totalSize || totalSize > MAX_IMAGE_SIZE) return error('单个图片不能超过 10M')
  if (chunk.size > MAX_REQUEST_FILE_SIZE) return error('单个分片不能超过 900KB')

  const extension = getExtension(originalName, contentType)
  if (!isAllowedImageType(extension)) return error('不支持的图片格式')

  const metaKey = `${UPLOAD_PREFIX}${sessionId}:meta`
  const chunkKey = `${UPLOAD_PREFIX}${sessionId}:chunk:${index}`
  const existingMeta = await getJson(kv, metaKey, null)
  const meta = existingMeta || {
    filename: createStoredFilename(originalName, contentType),
    originalName,
    contentType,
    totalSize,
    totalChunks,
    received: [],
    createdAt: Date.now()
  }

  const base64 = arrayBufferToBase64(await chunk.arrayBuffer())
  await kv.put(chunkKey, base64)
  meta.received = Array.from(new Set([...(meta.received || []), index])).sort((a, b) => a - b)
  await putJson(kv, metaKey, meta)

  if (!complete && meta.received.length < totalChunks) {
    return json({ uploading: true, received: meta.received.length, totalChunks })
  }

  if (meta.received.length < totalChunks) {
    return json({ uploading: true, received: meta.received.length, totalChunks })
  }

  const merged = new Uint8Array(totalSize)
  let offset = 0
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const storedChunk = await kv.get(`${UPLOAD_PREFIX}${sessionId}:chunk:${chunkIndex}`)
    if (!storedChunk) return error(`缺少第 ${chunkIndex + 1} 个分片`, 400)
    const bytes = base64ToUint8Array(storedChunk)
    merged.set(bytes, offset)
    offset += bytes.byteLength
  }

  const finalBase64 = arrayBufferToBase64(merged.buffer)
  await saveImageToKV(kv, {
    filename: meta.filename,
    originalName: meta.originalName,
    contentType: meta.contentType,
    base64: finalBase64,
    size: totalSize
  })

  const cleanup = [kv.delete(metaKey)]
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    cleanup.push(kv.delete(`${UPLOAD_PREFIX}${sessionId}:chunk:${chunkIndex}`))
  }
  await Promise.all(cleanup)

  return json({ url: getPublicUploadUrl(request, meta.filename), filename: meta.filename })
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestPost, onRequestOptions })
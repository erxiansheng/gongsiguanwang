"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { LogOut, RefreshCw, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { defaultSiteContent } from '@/lib/site-content'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  createdAt: number
}

export default function AdminPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123456')
  const [token, setToken] = useState<string | null>(null)
  const [contentText, setContentText] = useState(JSON.stringify(defaultSiteContent, null, 2))
  const [status, setStatus] = useState('请登录后编辑站点内容。')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSeedingImages, setIsSeedingImages] = useState(false)

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  useEffect(() => {
    const storedToken = window.localStorage.getItem('admin_token')
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    if (!token) return
    loadContent()
    loadMessages()
  }, [token])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('正在登录...')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '登录失败')
      setToken(result.token)
      window.localStorage.setItem('admin_token', result.token)
      setStatus('登录成功。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '登录失败')
    }
  }

  function logout() {
    setToken(null)
    window.localStorage.removeItem('admin_token')
    setStatus('已退出登录。')
  }

  async function loadContent() {
    if (!token) return
    setStatus('正在读取内容...')
    try {
      const response = await fetch('/api/admin/content', { headers: authHeaders, cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '读取内容失败')
      setContentText(JSON.stringify(result.content || defaultSiteContent, null, 2))
      setStatus('内容已加载。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '读取内容失败')
    }
  }

  async function saveContent() {
    if (!token) return
    setIsSaving(true)
    setStatus('正在保存内容...')
    try {
      const parsed = JSON.parse(contentText)
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ content: parsed }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '保存失败')
      setContentText(JSON.stringify(result.content, null, 2))
      setStatus('保存成功，前台刷新后会读取最新内容。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败，请检查内容格式。')
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!token || !file) return
    setIsUploading(true)
    setStatus('正在上传图片...')
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('单个图片不能超过 10M')

      const result = file.size > 900 * 1024
        ? await uploadImageInChunks(file)
        : await uploadImageDirectly(file)

      await navigator.clipboard?.writeText(result.url)
      setStatus(`上传成功，图片地址已复制：${result.url}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  async function uploadImageDirectly(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '上传失败')
    return result
  }

  async function uploadImageInChunks(file: File) {
    const chunkSize = 600 * 1024
    const totalChunks = Math.ceil(file.size / chunkSize)
    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    let finalResult: { url: string; filename: string } | null = null

    for (let index = 0; index < totalChunks; index++) {
      const start = index * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const formData = new FormData()
      formData.append('chunk', file.slice(start, end), file.name)
      formData.append('sessionId', sessionId)
      formData.append('index', String(index))
      formData.append('totalChunks', String(totalChunks))
      formData.append('filename', file.name)
      formData.append('contentType', file.type || 'image/png')
      formData.append('totalSize', String(file.size))
      formData.append('complete', String(index === totalChunks - 1))
      setStatus(`正在上传图片分片 ${index + 1}/${totalChunks}...`)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '分片上传失败')
      if (result.url) finalResult = result
    }

    if (!finalResult) throw new Error('图片合并失败')
    return finalResult
  }

  async function seedImagesToKV() {
    if (!token) return
    setIsSeedingImages(true)
    setStatus('正在初始化远程图片到 KV...')
    try {
      let currentContent = JSON.parse(contentText)
      let remaining = 1
      let processedCount = 0
      const failed: string[] = []

      while (remaining > 0) {
        const response = await fetch('/api/admin/seed-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          body: JSON.stringify({ content: currentContent, limit: 4 }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || '初始化图片失败')

        currentContent = result.content
        processedCount += result.processed?.length || 0
        remaining = result.remaining || 0
        if (Array.isArray(result.failed)) {
          result.failed.forEach((item: { source: string; error: string }) => failed.push(`${item.source}：${item.error}`))
        }
        setStatus(`已写入 ${processedCount} 张图片到 KV，剩余 ${remaining} 张...`)

        if ((result.processed?.length || 0) === 0 && remaining > 0) break
      }

      setContentText(JSON.stringify(currentContent, null, 2))
      const suffix = failed.length ? `\n部分图片失败：\n${failed.join('\n')}` : ''
      setStatus(`图片初始化完成，已替换为当前域名下的 KV 图片地址。请点击“保存内容”。${suffix}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '初始化图片失败')
    } finally {
      setIsSeedingImages(false)
    }
  }

  async function loadMessages() {
    if (!token) return
    try {
      const response = await fetch('/api/admin/messages', { headers: authHeaders, cache: 'no-store' })
      const result = await response.json()
      if (response.ok) setMessages(result.messages || [])
    } catch {
      setMessages([])
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="font-playfair text-3xl font-bold mb-2">后台登录</h1>
          <p className="text-muted-foreground mb-8">预留账号：admin，密码：admin123456。</p>
          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="text-sm font-medium">账号</label>
              <Input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">密码</label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2" />
            </div>
            <Button type="submit" className="w-full">登录</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6">{status}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold">站点内容管理</h1>
            <p className="text-muted-foreground mt-2">编辑下方内容并保存到 EdgeOne KV，前台会通过接口读取最新版本。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={loadContent}>
              <RefreshCw className="mr-2 h-4 w-4" />重新读取
            </Button>
            <Button onClick={saveContent} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />{isSaving ? '保存中' : '保存内容'}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />退出
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">全部可编辑内容</h2>
                <p className="text-sm text-muted-foreground mt-1">保持结构完整即可修改页面文字、图片、项目、伙伴、团队、常见问题和联系信息。</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
                <Upload className="mr-2 h-4 w-4" />{isUploading ? '上传中' : '上传图片'}
                <input type="file" accept="image/*,.svg,.webp" className="sr-only" onChange={uploadImage} />
              </label>
              <Button variant="outline" onClick={seedImagesToKV} disabled={isSeedingImages}>
                <Upload className="mr-2 h-4 w-4" />{isSeedingImages ? '初始化中' : '初始化图片到 KV'}
              </Button>
            </div>
            <Textarea
              value={contentText}
              onChange={(event) => setContentText(event.target.value)}
              spellCheck={false}
              className="min-h-[680px] resize-y font-mono text-sm leading-6"
            />
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-bold mb-3">状态</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{status}</p>
            </section>

            <section className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">联系留言</h2>
                <Button size="sm" variant="outline" onClick={loadMessages}>刷新</Button>
              </div>
              <div className="space-y-4">
                {messages.length === 0 && <p className="text-sm text-muted-foreground">暂无留言。</p>}
                {messages.map((message) => (
                  <div key={message.id} className="rounded-md border border-border p-4 text-sm">
                    <div className="font-medium">{message.name}</div>
                    <div className="text-muted-foreground">{message.email}</div>
                    {message.phone && <div className="text-muted-foreground">{message.phone}</div>}
                    {message.company && <div className="text-muted-foreground">{message.company}</div>}
                    <p className="mt-3 whitespace-pre-wrap">{message.message}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString('zh-CN')}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
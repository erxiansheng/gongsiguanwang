/**
 * API 基础地址配置
 * 开发环境使用远程后端，生产环境使用相对路径
 */
const isDev = process.env.NODE_ENV === 'development'

export const API_BASE = isDev ? 'https://jkyctest.dasb.cn/api' : '/api'

export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

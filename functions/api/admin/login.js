import { createESAHandler, createToken, error, handleCors, json } from '../_helpers.js'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123456'

export async function onRequestPost({ request, env }) {
  try {
    const { username, password } = await request.json()
    const validUsername = env?.ADMIN_USERNAME || DEFAULT_USERNAME
    const validPassword = env?.ADMIN_PASSWORD || DEFAULT_PASSWORD

    if (!username || !password) return error('请输入账号和密码')
    if (username !== validUsername || password !== validPassword) return error('账号或密码错误', 401)

    const token = await createToken({ role: 'admin', username }, env)
    return json({ token, username })
  } catch (requestError) {
    return error(requestError.message, 500)
  }
}

export async function onRequestOptions() {
  return handleCors()
}

export default createESAHandler({ onRequestPost, onRequestOptions })
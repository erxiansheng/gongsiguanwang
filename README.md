# 澄造数字网站模板

这是一个基于 Next.js、Tailwind CSS 和 EdgeOne Pages Functions 的中文品牌官网模板。前台页面默认使用本地中文内容，部署到 EdgeOne Pages 后可通过后台把整份站点内容保存到 KV，并由前台运行时读取最新版本。

## 技术栈

- 前端框架：Next.js
- 样式方案：Tailwind CSS
- 组件体系：shadcn/ui
- 类型系统：TypeScript
- 后端函数：EdgeOne Pages Functions
- 数据存储：EdgeOne Pages KV

## 页面与功能

- 首页：品牌首屏、服务、精选项目、客户评价和行动召唤
- 项目案例：项目列表、分类筛选、重点案例和协作流程
- 项目详情：按项目编号展示可编辑的详情内容
- 合作伙伴：伙伴列表、合作方式和合作收益
- 关于我们：团队故事、价值观和成员介绍
- 联系我们：联系表单、联系信息和常见问题
- 后台管理：`/admin` 登录后编辑站点内容、上传图片、查看联系留言

## 后台账号

默认预留账号如下，可在 EdgeOne Pages 环境变量中覆盖：

- 账号：`admin`
- 密码：`admin123456`
- 可选环境变量：`ADMIN_USERNAME`、`ADMIN_PASSWORD`、`ADMIN_TOKEN_SECRET`

## EdgeOne KV 配置

在 EdgeOne Pages 项目中创建并绑定 KV 命名空间，推荐变量名：

```text
site_kv
```

后端同时兼容 `SITE_KV` 和旧项目使用过的 `blog_data` 变量名。核心内容保存在 `site:content`，联系留言保存在 `contact:messages`，上传图片会以 `image:*` 和 `image_meta:*` 前缀保存到 KV。

## 本地开发

```bash
npm install
npm run dev
```

本地没有 EdgeOne KV 时，前台会自动使用 `lib/site-content.ts` 中的默认中文内容。后台保存功能需要部署到 EdgeOne Pages 并绑定 KV 后使用。

## 构建

```bash
npm run build
```

项目当前配置为静态导出，适合与 EdgeOne Pages Functions 一起部署。前台静态页面通过浏览器请求 `/api/content` 读取 KV 内容。

## 主要目录

```text
app/                 页面路由
app/admin/           后台管理页
components/          通用组件
functions/api/       EdgeOne API 函数
functions/uploads/   KV 图片读取函数
hooks/               前端数据 Hook
lib/site-content.ts  中文默认内容与类型定义
```

## 内容编辑说明

进入 `/admin` 后可按模块可视化编辑整份站点内容，包括站点信息、SEO、浏览器标题、站点图标、备案号、导航、首页、项目、关于、合作伙伴和联系页。图片上传成功后会复制当前域名下的图片地址，可粘贴到对应图片字段中。

后台图片上传单个文件上限为 10M。文件较小时直接上传；文件超过 EdgeOne 函数请求体上限时，前端会自动分片上传，服务端在收到全部分片后合并成一个 base64 值写入 KV。

“初始化图片到 KV”会把当前内容里的远程图片下载到 KV，并把图片字段替换成当前项目域名下的 `/uploads/...` 地址。替换完成后需要点击“保存内容”，让前台读取最新内容。
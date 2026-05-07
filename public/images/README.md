# 静态图片目录

将图片放入对应子目录后，部署到 EdgeOne Pages 即可直接通过 URL 访问。

## 目录结构

```
public/images/
├── banner/     # 首页 Hero、各页面顶部横幅大图
├── projects/   # 项目案例图片
├── partners/   # 合作伙伴 Logo / 封面图
├── team/       # 团队成员头像
└── misc/       # 其他杂项图片（二维码、图标等）
```

## 访问方式

构建后（`npm run build`），`public/` 下的文件会原样复制到 `out/`。

| 本地文件路径 | 部署后访问 URL |
|---|---|
| `public/images/banner/hero.jpg` | `https://your-domain.com/images/banner/hero.jpg` |
| `public/images/projects/case1.jpg` | `https://your-domain.com/images/projects/case1.jpg` |
| `public/images/team/avatar.png` | `https://your-domain.com/images/team/avatar.png` |

## 在内容配置中引用

在后台管理 `/admin` 配置图片 URL 时，直接填写相对路径即可：

```
/images/banner/hero.jpg
/images/projects/case1.jpg
```

## 推荐规格

| 用途 | 建议尺寸 | 格式 |
|---|---|---|
| Hero 横幅 | 1920×1080 | JPG（压缩后 < 500KB） |
| 项目封面 | 1200×800 | JPG（压缩后 < 300KB） |
| 合作伙伴 Logo | 800×600 | JPG/PNG |
| 团队头像 | 400×400 | JPG/PNG |

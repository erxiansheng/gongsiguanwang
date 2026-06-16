# SMTP Notifier Cloud Function

用于接收站点 `/api/contact` 的 HTTP 请求，并通过 SMTP 发送联系表单通知邮件。

## 配置方式

后台“SMTP 通知邮箱”只需要填写：

- 通知邮箱
- SMTP 服务器
- SMTP 端口
- SMTP 用户名
- SMTP 密码

站点联系接口默认请求同域固定路径 `/smtp-notifier`。如果 Python 云函数部署成了其他地址，请修改 `functions/api/contact.js` 顶部的 `MAIL_GATEWAY_URL` 常量。

默认不启用网关密钥校验。如果需要启用，请同时修改 `functions/api/contact.js` 的 `MAIL_GATEWAY_SECRET` 和本文件夹 `index.py` 的 `NOTIFIER_SECRET`，两边保持一致。

## 本地调试

```bash
edgeone makers dev
```

部署到 EdgeOne 后，Python 云函数地址为：

```text
/smtp-notifier
```

## 请求格式

站点会自动发送如下结构：

```json
{
  "smtp": {
    "host": "smtp.example.com",
    "port": 465,
    "secure": true,
    "username": "name@example.com",
    "password": "smtp-auth-code"
  },
  "message": {
    "from": "name@example.com",
    "to": ["notice@example.com"],
    "replyTo": "name@example.com",
    "subject": "【金科云创官网留言】访客提交了联系信息",
    "html": "<html>...</html>",
    "text": "..."
  }
}
```

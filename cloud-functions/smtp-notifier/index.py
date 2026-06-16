import json
import smtplib
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler


NOTIFIER_SECRET = ""


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self._send_json({}, 204)

    def do_GET(self):
        self._send_json({"success": True, "service": "smtp-notifier"})

    def do_POST(self):
        expected_secret = NOTIFIER_SECRET
        received_secret = self.headers.get("X-Notification-Secret", "")
        if expected_secret and received_secret != expected_secret:
            self._send_json({"success": False, "error": "Unauthorized"}, 401)
            return

        try:
            payload = self._read_json_body()
            smtp_config = payload.get("smtp") or {}
            message_config = payload.get("message") or {}
            _send_mail(smtp_config, message_config)
        except ValueError as exc:
            self._send_json({"success": False, "error": str(exc)}, 400)
            return
        except Exception as exc:
            self._send_json({"success": False, "error": str(exc)}, 500)
            return

        self._send_json({"success": True})

    def _read_json_body(self):
        content_length = int(self.headers.get("Content-Length", "0") or 0)
        raw_body = self.rfile.read(content_length).decode("utf-8") if content_length else ""
        if not raw_body:
            return {}

        try:
            return json.loads(raw_body)
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid JSON body") from exc

    def _send_json(self, data, status=200):
        body = b""
        if status != 204:
            body = json.dumps(data, ensure_ascii=False).encode("utf-8")

        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Notification-Secret")
        if status != 204:
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
        self.end_headers()

        if body:
            self.wfile.write(body)


def _send_mail(smtp_config, message_config):
    host = _required(smtp_config.get("host"), "Missing smtp.host")
    port = int(smtp_config.get("port") or 465)
    username = _required(smtp_config.get("username"), "Missing smtp.username")
    password = _required(smtp_config.get("password"), "Missing smtp.password")
    secure = smtp_config.get("secure") is not False

    sender = _required(message_config.get("from"), "Missing message.from")
    recipients = message_config.get("to") or []
    if isinstance(recipients, str):
        recipients = [item.strip() for item in recipients.replace(";", ",").split(",") if item.strip()]
    if not recipients:
        raise ValueError("Missing message.to")

    subject = _required(message_config.get("subject"), "Missing message.subject")
    text = message_config.get("text") or ""
    html = message_config.get("html") or ""
    reply_to = message_config.get("replyTo") or sender

    email = EmailMessage()
    email["Subject"] = subject
    email["From"] = sender
    email["To"] = ", ".join(recipients)
    if reply_to:
        email["Reply-To"] = reply_to
    email.set_content(text or "New contact form notification")
    if html:
        email.add_alternative(html, subtype="html")

    if secure:
        server = smtplib.SMTP_SSL(host, port, timeout=15)
    else:
        server = smtplib.SMTP(host, port, timeout=15)
        if port == 587:
            server.starttls()

    with server:
        server.login(username, password)
        server.send_message(email)


def _required(value, message):
    value = str(value or "").strip()
    if not value:
        raise ValueError(message)
    return value

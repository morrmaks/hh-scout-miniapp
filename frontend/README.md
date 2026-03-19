# 🧑‍💻 Development Guide

Этот файл описывает, как запускать проект и как работают режимы.

---

# 🚀 Быстрый старт

```bash
npm install
npm run dev
```

- Frontend → http://localhost:5173
- Backend → http://localhost:3000

---

# ⚙️ ENV

Файл: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

Подробнее про переменные см. в `.env.example`

---

# 🌐 Tunnel режим (HTTPS)

Для внешнего доступа (например Telegram или тестирование через HTTPS) используем туннель.

## 1. Запуск проекта

```bash
npm run dev:ngrok
```

## 2. Поднять туннель (любой)

### ngrok

```bash
ngrok http 5173
```

### или cloudflared

```bash
cloudflared tunnel --url http://localhost:5173
```

---

## 3. ENV для tunnel режима

```env
VITE_API_URL=/api
```

---

# 📦 Скрипты

```bash
npm run dev        # обычный режим
npm run dev:ngrok  # режим с HTTPS туннелем
```

---

# 🧠 Важно

- `.env.local` НЕ использовать
- backend всегда должен быть запущен
- Telegram требует HTTPS

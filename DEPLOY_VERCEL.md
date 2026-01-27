# 🚀 Hướng dẫn Deploy HSK AI lên Vercel

## Tổng quan

Ứng dụng HSK AI gồm 2 phần cần deploy riêng:

1. **WebSocket Server** (`server/`) - Xử lý real-time audio streaming với Gemini Live API
2. **Next.js Frontend** (root `/`) - Giao diện người dùng

---

## Phần 1: Deploy WebSocket Server

### Bước 1: Tạo project mới trên Vercel

```bash
cd server
vercel
```

Khi được hỏi:
- **Set up and deploy?** → `Y`
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → `N`
- **Project name?** → `hsk-ai-websocket` (hoặc tên khác)
- **Directory?** → `./`
- **Override settings?** → `N`

### Bước 2: Cấu hình Environment Variables

Vào Vercel Dashboard → Project `hsk-ai-websocket` → Settings → Environment Variables

Thêm biến:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `your-gemini-api-key-here` |
| `WS_PORT` | `3002` |

### Bước 3: Deploy production

```bash
cd server
vercel --prod
```

### Bước 4: Lấy URL

Sau khi deploy xong, bạn sẽ có URL dạng:
```
https://hsk-ai-websocket.vercel.app
```

**Lưu ý:** WebSocket URL sẽ là:
```
wss://hsk-ai-websocket.vercel.app/ws
```

---

## Phần 2: Deploy Next.js Frontend

### Bước 1: Cấu hình WebSocket URL

Tạo file `.env.production` trong thư mục gốc:

```bash
# .env.production
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_WS_URL=wss://hsk-ai-websocket.vercel.app/ws
```

### Bước 2: Tạo project mới trên Vercel

```bash
# Ở thư mục gốc (không phải server/)
vercel
```

Khi được hỏi:
- **Set up and deploy?** → `Y`
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → `N`
- **Project name?** → `hsk-ai` (hoặc tên khác)
- **Directory?** → `./`
- **Framework detected: Next.js** → Enter để xác nhận
- **Override settings?** → `N`

### Bước 3: Cấu hình Environment Variables

Vào Vercel Dashboard → Project `hsk-ai` → Settings → Environment Variables

Thêm biến:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `your-gemini-api-key-here` |
| `NEXT_PUBLIC_WS_URL` | `wss://hsk-ai-websocket.vercel.app/ws` |

### Bước 4: Deploy production

```bash
vercel --prod
```

---

## 🔧 Chạy Local để Test

### Terminal 1: WebSocket Server

```bash
cd server
npm install
node index.js
```

Server sẽ chạy tại: `ws://localhost:3002/ws`

### Terminal 2: Next.js Frontend

```bash
# Ở thư mục gốc
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### File `.env` cho Local

Tạo file `.env` ở thư mục gốc:

```bash
# .env
GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_WS_URL=ws://localhost:3002/ws
WS_PORT=3002
```

---

## 📋 Checklist trước khi Deploy

- [ ] Đã có `GEMINI_API_KEY` từ [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Test local thành công (cả WebSocket và Frontend)
- [ ] Đã deploy WebSocket server và có URL
- [ ] Đã cập nhật `NEXT_PUBLIC_WS_URL` với URL của WebSocket server

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "WebSocket connection failed"

**Nguyên nhân:** URL WebSocket sai hoặc server chưa chạy

**Giải pháp:**
1. Kiểm tra `NEXT_PUBLIC_WS_URL` đúng format: `wss://your-domain.vercel.app/ws`
2. Kiểm tra WebSocket server đã deploy thành công
3. Kiểm tra logs trên Vercel Dashboard

### Lỗi: "GEMINI_API_KEY is required"

**Nguyên nhân:** Chưa set environment variable

**Giải pháp:**
1. Vào Vercel Dashboard → Settings → Environment Variables
2. Thêm `GEMINI_API_KEY` với giá trị API key của bạn
3. Redeploy: `vercel --prod`

### Lỗi: "Microphone access denied"

**Nguyên nhân:** Trình duyệt chặn microphone

**Giải pháp:**
1. Website phải chạy trên HTTPS (Vercel tự động có)
2. Cho phép microphone trong browser settings

---

## 🏗️ Cấu trúc Project

```
hsk-ai/
├── server/                 # WebSocket Server (deploy riêng)
│   ├── index.js           # Entry point
│   ├── package.json       # Dependencies
│   ├── services/          # Gemini Live Service
│   ├── controllers/       # WebSocket handlers
│   └── config/            # Prompts & configs
│
├── src/                   # Next.js Frontend
│   ├── app/              # Pages
│   ├── components/       # UI Components
│   ├── hooks/            # Custom hooks (WebSocket, Audio)
│   └── contexts/         # Theme context
│
├── .env                  # Local environment
├── .env.production       # Production environment
└── package.json          # Frontend dependencies
```

---

## 🎯 Luồng hoạt động

```
User Opens Talk Page
        ↓
Connect to WebSocket Server (wss://...)
        ↓
Click Microphone → Start Recording
        ↓
Audio chunks → WebSocket → Gemini Live API
        ↓
Gemini responds with:
  - Audio (played back to user)
  - Text transcription (displayed in chat)
        ↓
Both user speech and AI response shown as text
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong browser (F12)
2. Vercel Logs: Dashboard → Deployments → View Logs
3. Network tab: Kiểm tra WebSocket connection

---

**Good luck! 🍀**

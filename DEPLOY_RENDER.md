# Hướng dẫn Deploy WebSocket Server lên Render.com

## 🚀 Các bước deploy:

### **Bước 1: Click "New Web Service"**

Trong màn hình Render Dashboard, click vào **"New Web Service"** (như trong ảnh bạn đang xem).

### **Bước 2: Connect GitHub Repository**

1. Click "Connect account" nếu chưa connect GitHub
2. Authorize Render truy cập GitHub
3. Chọn repository: `haidevelopment/AI-live_tailk-hsk`
4. Click "Connect"

### **Bước 3: Cấu hình Service**

Điền thông tin như sau:

**Name:**
```
hsk-ai-websocket
```

**Region:**
```
Singapore (hoặc gần Việt Nam nhất)
```

**Branch:**
```
main
```

**Root Directory:**
```
server
```
⚠️ **QUAN TRỌNG**: Phải chọn `server` vì WebSocket code nằm trong thư mục này!

**Runtime:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
node index.js
```

**Instance Type:**
```
Free
```

### **Bước 4: Environment Variables**

Click "Advanced" → "Add Environment Variable"

Thêm 2 biến:

**Variable 1:**
```
Key: GEMINI_API_KEY
Value: [Paste API key của bạn từ Google AI Studio]
```

**Variable 2:**
```
Key: WS_PORT
Value: 3002
```

### **Bước 5: Deploy**

1. Click "Create Web Service"
2. Đợi 2-3 phút để Render build và deploy
3. Xem logs để đảm bảo không có lỗi

### **Bước 6: Lấy WebSocket URL**

Sau khi deploy thành công, bạn sẽ có URL dạng:
```
https://hsk-ai-websocket.onrender.com
```

WebSocket URL sẽ là:
```
wss://hsk-ai-websocket.onrender.com/ws
```

⚠️ **Chú ý**: 
- HTTPS → WSS (WebSocket Secure)
- Thêm `/ws` ở cuối

### **Bước 7: Update Next.js Environment Variable**

1. Vào Vercel Dashboard
2. Chọn project Next.js: `ai-live-tailk-hsk-bong`
3. Settings → Environment Variables
4. Sửa `NEXT_PUBLIC_WS_URL`:
   ```
   NEXT_PUBLIC_WS_URL=wss://hsk-ai-websocket.onrender.com/ws
   ```
5. Click "Save"
6. Redeploy Next.js (Deployments → Redeploy)

### **Bước 8: Test**

1. Truy cập Next.js app: `https://ai-live-tailk-hsk-bong.vercel.app`
2. Chọn HSK level và topic
3. Click "Bắt đầu nói"
4. Kiểm tra Console - không còn WebSocket error

---

## 🔍 Troubleshooting

### WebSocket không kết nối

**Kiểm tra:**
1. Render service có đang chạy không? (Dashboard → Service → Logs)
2. Environment variables đã set đúng chưa?
3. URL có đúng format `wss://domain.onrender.com/ws` không?

**Debug:**
```javascript
// Mở Console trong browser
console.log('WS URL:', process.env.NEXT_PUBLIC_WS_URL);
```

### Render service sleep (Free tier)

Render free tier sẽ sleep sau 15 phút không hoạt động.
- Lần đầu kết nối sẽ mất 30-60 giây để wake up
- Sau đó hoạt động bình thường

**Giải pháp:**
- Upgrade lên paid plan ($7/tháng) để không sleep
- Hoặc chấp nhận delay lần đầu

### GEMINI_API_KEY invalid

```bash
# Test API key
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY"
```

---

## 📝 Files đã tạo

- ✅ `server/render.yaml` - Render config (optional)
- ✅ `server/index.js` - WebSocket server
- ✅ `server/package.json` - Dependencies

---

## 🎉 Hoàn thành!

Bây giờ bạn có:
- **WebSocket Server**: `https://hsk-ai-websocket.onrender.com`
- **WebSocket Endpoint**: `wss://hsk-ai-websocket.onrender.com/ws`
- **Next.js Frontend**: `https://ai-live-tailk-hsk-bong.vercel.app`

Hệ thống đã sẵn sàng để luyện nói tiếng Trung với AI! 🇨🇳🎤

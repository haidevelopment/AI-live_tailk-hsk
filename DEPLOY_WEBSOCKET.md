# Hướng dẫn Deploy WebSocket Server lên Vercel

## Bước 1: Chuẩn bị WebSocket Server

WebSocket server đã được cấu hình sẵn trong thư mục `/server`:
- ✅ `vercel.json` đã được tạo
- ✅ `package.json` có dependencies
- ✅ `index.js` là entry point

## Bước 2: Deploy WebSocket Server lên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Truy cập Vercel Dashboard**
   - Vào https://vercel.com/new
   - Import repository: `haidevelopment/AI-live_tailk-hsk`

2. **Cấu hình Project**
   - **Project Name**: `hsk-ai-websocket` (hoặc tên bạn muốn)
   - **Framework Preset**: `Other`
   - **Root Directory**: `server` ⚠️ **QUAN TRỌNG**
   - **Build Command**: Để trống
   - **Output Directory**: Để trống
   - **Install Command**: `npm install`

3. **Environment Variables**
   Click "Environment Variables" và thêm:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   ⚠️ Lấy API key từ: https://aistudio.google.com/app/apikey

4. **Deploy**
   - Click "Deploy"
   - Đợi 1-2 phút
   - Sau khi deploy xong, bạn sẽ có URL: `https://hsk-ai-websocket.vercel.app`

### Cách 2: Deploy qua CLI

```bash
cd server
vercel --prod
```

## Bước 3: Lấy WebSocket URL

Sau khi deploy xong, bạn sẽ có URL dạng:
```
https://hsk-ai-websocket.vercel.app
```

WebSocket URL sẽ là:
```
wss://hsk-ai-websocket.vercel.app/ws
```

⚠️ **Chú ý**: 
- Local: `ws://` (không SSL)
- Production: `wss://` (có SSL)

## Bước 4: Cập nhật Next.js Client

1. **Tạo file `.env.local`** trong thư mục root:
```bash
# Copy từ .env.example
cp .env.example .env.local
```

2. **Sửa `.env.local`**:
```env
GEMINI_API_KEY=your_gemini_api_key_here

# Thay URL này bằng URL WebSocket server vừa deploy
NEXT_PUBLIC_WS_URL=wss://hsk-ai-websocket.vercel.app/ws

WS_PORT=3002
```

## Bước 5: Deploy Next.js Frontend

1. **Truy cập Vercel Dashboard**
   - Vào https://vercel.com/new
   - Import repository: `haidevelopment/AI-live_tailk-hsk`

2. **Cấu hình Project**
   - **Project Name**: `hsk-ai-client` (hoặc tên bạn muốn)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_WS_URL=wss://hsk-ai-websocket.vercel.app/ws
   ```

4. **Deploy**
   - Click "Deploy"
   - Đợi 2-3 phút

## Bước 6: Test

1. Truy cập Next.js app: `https://hsk-ai-client.vercel.app`
2. Chọn HSK level và topic
3. Click "Bắt đầu nói"
4. Kiểm tra WebSocket connection trong Console

## Troubleshooting

### WebSocket không kết nối được

**Kiểm tra:**
1. URL có đúng format `wss://` không?
2. Environment variable `NEXT_PUBLIC_WS_URL` đã set đúng chưa?
3. GEMINI_API_KEY có hợp lệ không?

**Debug:**
```javascript
// Mở Console trong browser
console.log('WS URL:', process.env.NEXT_PUBLIC_WS_URL);
```

### CORS Error

Vercel tự động handle CORS, nhưng nếu gặp lỗi:
- Kiểm tra WebSocket server có chạy đúng không
- Xem logs trên Vercel Dashboard

### Gemini API Error

```bash
# Kiểm tra API key
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY"
```

## Lưu ý quan trọng

1. **WebSocket URL phải có `/ws` ở cuối**
   - ✅ `wss://domain.vercel.app/ws`
   - ❌ `wss://domain.vercel.app`

2. **Environment Variables**
   - Next.js: Phải có prefix `NEXT_PUBLIC_` để dùng ở client
   - WebSocket server: Không cần prefix

3. **Vercel Limits**
   - WebSocket timeout: 60 giây (Hobby plan)
   - Nếu cần timeout dài hơn, upgrade plan

## Cấu trúc Project

```
hsk-ai/
├── server/              # WebSocket Server (Deploy riêng)
│   ├── index.js
│   ├── package.json
│   └── vercel.json
├── src/                 # Next.js Frontend (Deploy riêng)
│   ├── app/
│   ├── components/
│   └── hooks/
├── .env.example
└── .env.local          # Tạo file này
```

## URLs sau khi deploy

- **WebSocket Server**: `https://hsk-ai-websocket.vercel.app`
- **WebSocket Endpoint**: `wss://hsk-ai-websocket.vercel.app/ws`
- **Next.js Frontend**: `https://hsk-ai-client.vercel.app`

---

**Hoàn thành!** 🎉

Bây giờ bạn có thể luyện nói tiếng Trung với AI ở bất kỳ đâu!

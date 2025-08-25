# Hướng dẫn Setup EmailJS + Cloudinary cho Production

## Bước 1: Setup Cloudinary

### 1.1. Tạo tài khoản Cloudinary
1. Vào https://cloudinary.com
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng ký, vào Dashboard

### 1.2. Lấy thông tin cần thiết
Trong Dashboard, bạn sẽ thấy:
- **Cloud Name**: ví dụ `your-cloud-name`
- **API Key**: ví dụ `123456789012345`
- **API Secret**: ví dụ `abcdefghijklmnopqrstuvwxyz`

### 1.3. Setup Upload Preset
1. Vào Settings → Upload
2. Tạo Upload Preset mới:
   - Preset name: `brothers2025_upload`
   - Signing Mode: `Unsigned`
   - Folder: `brothers2025/events`
   - Allowed formats: `jpg,png,jpeg,gif,webp`
   - Max file size: `5MB`

## Bước 2: Setup EmailJS

### 2.1. Tạo tài khoản EmailJS
1. Vào https://www.emailjs.com
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

### 2.2. Tạo Email Service
1. Vào Dashboard → Email Services
2. Chọn Gmail hoặc service email của bạn
3. Connect với email của bạn
4. Lưu **Service ID** (ví dụ: `service_abc123`)

### 2.3. Tạo Email Template
1. Vào Dashboard → Email Templates
2. Tạo template mới với nội dung:

```
Subject: [ĐĂNG KÝ] {{event_title}} - {{student_name}}

Xin chào Ban Tổ chức,

Có sinh viên mới đăng ký tham gia sự kiện:

📅 Sự kiện: {{event_title}}
🗓️ Ngày: {{event_date}}
👤 Tên sinh viên: {{student_name}}
🆔 Mã số sinh viên: {{student_id}}
📷 Ảnh đại diện: {{image_url}}
✅ Xác nhận tham gia: {{confirmed}}

Thời gian đăng ký: {{current_time}}

Trân trọng,
Hệ thống Brothers2025
```

3. Lưu **Template ID** (ví dụ: `template_xyz789`)

### 2.4. Lấy Public Key
1. Vào Account → General
2. Copy **Public Key** (ví dụ: `user_abcdefghijk`)

## Bước 3: Cập nhật Code

### 3.1. Cập nhật Events.tsx
Mở file `client/pages/Events.tsx` và thay thế:

```typescript
// Dòng 80: Thay upload preset
upload_preset: 'brothers2025_upload'

// Dòng 82: Thay YOUR_CLOUD_NAME
'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload'

// Dòng 125-129: Cập nhật EmailJS IDs
'service_brothers2025'   // Service ID đã có ✅
'template_npima9o'       // Template ID đã có ✅
'VXMCL985bTWO8kVZq'     // Public Key đã có ✅
```

### 3.2. Thêm EmailJS Script
Mở file `index.html` và thêm script:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script type="text/javascript">
   (function(){
      emailjs.init("VXMCL985bTWO8kVZq"); // Public Key Brothers2025
   })();
</script>
```

## Bước 4: Test

### 4.1. Test Local
1. Chạy frontend: `npm run dev`
2. Vào trang Events
3. Thử đăng ký 1 sự kiện với ảnh
4. Kiểm tra email và Cloudinary

### 4.2. Kiểm tra kết quả
- **Cloudinary**: Ảnh được upload vào folder `events`
- **Email**: Nhận được email với thông tin đăng ký
- **Console**: Không có lỗi trong DevTools

## Bước 5: Deploy Production

### 5.1. Chuẩn bị
- Build frontend: `npm run build`
- Upload lên hosting (Netlify/Vercel)

### 5.2. Environment Variables (nếu cần)
```
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=events_upload
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_abcdefghijk
```

## Troubleshooting

### Lỗi thường gặp:
1. **Cloudinary upload failed**: Kiểm tra Cloud Name và Upload Preset
2. **EmailJS không gửi**: Kiểm tra Service ID, Template ID, Public Key
3. **CORS error**: Thêm domain vào Allowed Origins trong EmailJS settings

### Test nhanh:
```javascript
// Test Cloudinary
fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
  method: 'POST',
  body: new FormData()
})

// Test EmailJS
emailjs.send('service_id', 'template_id', {}, 'public_key')
```

## Chi phí:
- **Cloudinary Free**: 25 credits/month (~25,000 ảnh)
- **EmailJS Free**: 200 emails/month

Đủ dùng cho hệ thống events của trường!

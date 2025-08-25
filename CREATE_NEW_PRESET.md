# 🛠️ TẠO PRESET MỚI - FIX LỖI 401

## ❌ Vấn đề với preset `windsnguyen`:
- **use filename: false** + **unique filename: false** có thể gây conflict
- Settings không tối ưu cho upload từ browser

## ✅ Giải pháp: Tạo preset mới `brothers2025`

### 🔧 Bước 1: Tạo preset trong Cloudinary Dashboard

1. **Vào Cloudinary Dashboard**
2. **Settings** → **Upload** → **Add upload preset**
3. **Điền thông tin:**

```
Preset name: brothers2025
Signing mode: Unsigned ⚠️ QUAN TRỌNG!
Asset folder: Brothers2025/events

📋 Advanced settings:
✅ Overwrite: false (tránh ghi đè)
✅ Use filename: true (giữ tên file)
✅ Unique filename: true (tránh trùng lặp)
✅ Use filename as display name: true
✅ Use asset folder as public ID prefix: false

📁 Allowed formats: jpg,png,jpeg,gif,webp
📏 Max file size: 10MB
🎯 Resource type: Auto
```

4. **Save**

### 🔄 Bước 2: Code đã được update
✅ Đã thay preset từ `windsnguyen` → `brothers2025`

### 🚀 Bước 3: Test ngay
```bash
npm run dev
```

### 📊 Bước 4: Xem logs trong Console
- `🔄 Uploading to Cloudinary...`
- `📊 Response status: 200` (thành công) hoặc `401` (vẫn lỗi)
- `✅ Upload thành công: https://...` hoặc error details

## 🎯 Kết quả mong đợi:
- **Status 200**: Upload thành công với preset mới
- **Ảnh trong folder**: `Brothers2025/events/`
- **URL format**: `https://res.cloudinary.com/windsnguyen/image/upload/Brothers2025/events/filename_unique.jpg`

## 🔄 Nếu vẫn lỗi 401:

### Backup Plan A: Sử dụng Base64 (không cần Cloudinary)
```typescript
// Convert ảnh thành base64 và gửi trong email
const reader = new FileReader();
reader.onload = () => {
  const base64Image = reader.result;
  // Gửi base64 trong email thay vì URL
};
reader.readAsDataURL(file);
```

### Backup Plan B: Upload lên ImgBB (alternative)
```typescript
const formData = new FormData();
formData.append('image', file);
formData.append('key', 'YOUR_IMGBB_API_KEY');

fetch('https://api.imgbb.com/1/upload', {
  method: 'POST',
  body: formData
});
```

## 💡 Lý do settings quan trọng:
- **Unsigned**: Frontend có thể upload trực tiếp
- **Unique filename**: Tránh conflict file trùng tên
- **Use filename**: Giữ tên gốc cho dễ nhận diện
- **Asset folder**: Organize ảnh theo từng event

**Hãy tạo preset `brothers2025` với settings trên và test lại!** 🚀

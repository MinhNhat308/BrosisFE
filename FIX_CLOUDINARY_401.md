# 🔧 FIX LỖI 401 Unauthorized - Cloudinary

## ❌ Vấn đề hiện tại:
Preset `windsnguyen` có thể đang ở chế độ **Signed** thay vì **Unsigned**, gây ra lỗi 401.

## ✅ Giải pháp: Tạo Upload Preset Unsigned mới

### Bước 1: Tạo Preset mới trong Cloudinary
1. **Đăng nhập Cloudinary** → Dashboard
2. **Vào Settings** → **Upload**
3. **Click "Add upload preset"**
4. **Điền thông tin:**
   ```
   Preset name: brothers2025_unsigned
   Signing Mode: Unsigned ⚠️ QUAN TRỌNG!
   Folder: Brothers2025/events
   Allowed formats: jpg,png,jpeg,gif,webp
   Max file size: 10MB
   ```
5. **Save**

### Bước 2: Code đã được update
✅ Đã thay đổi trong `Events.tsx` dòng 79:
```typescript
cloudinaryFormData.append('upload_preset', 'brothers2025_unsigned');
```

### Bước 3: Test lại
```bash
npm run dev
```
- Vào Events page
- Thử đăng ký với ảnh
- Kiểm tra Console (F12)

## 🔄 Nếu vẫn lỗi, thử phương án khác:

### Phương án A: Sử dụng preset có sẵn (nếu đã Unsigned)
Trong Cloudinary Dashboard:
1. **Settings** → **Upload**
2. **Click vào preset `windsnguyen`**
3. **Thay đổi Signing Mode** → **Unsigned**
4. **Save**

### Phương án B: Upload với signature (phức tạp hơn)
Cần tạo signature ở backend, không khuyến khích cho frontend.

## 📋 Checklist debug:

### ✅ Kiểm tra Cloudinary Dashboard:
- [ ] Preset `brothers2025_unsigned` đã tạo?
- [ ] Signing Mode = **Unsigned**?
- [ ] Status = **Enabled**?

### ✅ Kiểm tra Console:
- [ ] URL đúng: `https://api.cloudinary.com/v1_1/windsnguyen/image/upload`?
- [ ] Request có `upload_preset` field?
- [ ] Response code = 200?

## 💡 Lý do lỗi 401:
- **Signed preset**: Cần signature từ backend
- **Unsigned preset**: Frontend có thể upload trực tiếp
- **Disabled preset**: Không thể sử dụng

## 🚀 Sau khi fix:
- ✅ Upload thành công
- ✅ Ảnh xuất hiện trong `Brothers2025/events` folder
- ✅ Email nhận được với link ảnh
- ✅ Form reset về trạng thái ban đầu

**Hãy tạo preset `brothers2025_unsigned` và test lại!**

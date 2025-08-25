# 🔍 DEBUG CLOUDINARY 401 ERROR

## 🚨 Vấn đề: Vẫn lỗi 401 sau khi setup Unsigned preset

### 📋 Checklist Debug:

#### 1. ✅ Kiểm tra Preset trong Cloudinary Dashboard:
- [ ] **Vào Settings → Upload**
- [ ] **Tìm preset `windsnguyen`**
- [ ] **Kiểm tra:**
  - Signing Mode = **Unsigned** ✅
  - Status = **Enabled** ✅
  - PID = `d17e1756-d87c-4cc4-ad4d-0b13dedb6f18` ✅

#### 2. 🔧 Test Manual Upload:
Mở **Console** trong browser (F12) và chạy:

```javascript
// Test Cloudinary upload trực tiếp
const testUpload = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'windsnguyen');
    
    console.log('Testing upload...');
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/windsnguyen/image/upload', {
        method: 'POST',
        body: formData
      });
      
      console.log('Status:', response.status);
      console.log('Response:', await response.text());
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  input.click();
};

testUpload();
```

#### 3. 🔄 Giải pháp thay thế:

**Option A: Tạo preset mới hoàn toàn**
1. Xóa preset `windsnguyen` cũ
2. Tạo preset mới: `brothers2025_test`
3. Đảm bảo: **Unsigned**, **Enabled**

**Option B: Upload không cần preset**
Thử upload với chỉ API Key (cần signature):

```javascript
// Test upload với API signature
const timestamp = Math.round((new Date).getTime()/1000);
const string_to_sign = `timestamp=${timestamp}YOUR_API_SECRET`;
// Cần tạo signature hash ở backend
```

#### 4. 🚀 Quick Fix Code Update:

Trong `Events.tsx`, thêm fallback không dùng Cloudinary:

```typescript
// Fallback: Chuyển ảnh thành base64 và gửi trong email
if (registrationData.student_image) {
  const reader = new FileReader();
  reader.onload = () => {
    imageUrl = reader.result; // Base64 string
    // Tiếp tục gửi email...
  };
  reader.readAsDataURL(registrationData.student_image);
}
```

## 🎯 Kết luận:
- **Vấn đề có thể là**: Preset chưa được save đúng cách
- **Test manual** để xác định chính xác lỗi
- **Fallback**: Gửi email mà không upload ảnh lên cloud

## 💡 Tips:
- Kiểm tra Network tab trong DevTools để xem request/response chi tiết
- Thử upload file nhỏ (<1MB) trước
- Đảm bảo file type là image (jpg, png, gif...)

**Hãy chạy test manual trong Console để xem lỗi cụ thể!**

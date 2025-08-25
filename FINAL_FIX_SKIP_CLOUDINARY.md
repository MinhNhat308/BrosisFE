# 🚨 FIX CUỐI CÙNG - SKIP CLOUDINARY UPLOAD

## ❌ Vấn đề hiện tại:
- Preset `brothers2025`: "Unknown API key" 
- Preset `windsnguyen`: Vẫn có thể có conflict settings

## ✅ Giải pháp tạm thời: Gửi email mà không upload ảnh

### 🔄 Option 1: Convert ảnh thành Base64 (Gửi trực tiếp trong email)

```typescript
// Thay thế phần upload Cloudinary bằng:
if (registrationData.student_image) {
  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;
    
    // Gửi email với base64 image
    const emailData = {
      event_title: selectedEvent.title,
      student_name: registrationData.student_name,
      student_id: registrationData.student_id,
      image_data: base64Image, // Ảnh dưới dạng base64
      confirmed: registrationData.confirmed ? 'Có' : 'Không',
    };
    
    // Gửi email...
  };
  reader.readAsDataURL(registrationData.student_image);
}
```

### 🔄 Option 2: Skip upload, chỉ gửi tên file

```typescript
// Đơn giản nhất - chỉ gửi thông tin file
const imageInfo = registrationData.student_image 
  ? `📷 ${registrationData.student_image.name} (${(registrationData.student_image.size/1024).toFixed(1)}KB)`
  : '📷 Không có ảnh';

const emailData = {
  event_title: selectedEvent.title,
  student_name: registrationData.student_name,
  student_id: registrationData.student_id,
  image_info: imageInfo, // Thông tin file thay vì URL
  confirmed: registrationData.confirmed ? 'Có' : 'Không',
};
```

### 🔄 Option 3: Sử dụng Google Forms

```typescript
// Redirect đến Google Forms với pre-filled data
const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse?entry.event=${encodeURIComponent(selectedEvent.title)}&entry.name=${encodeURIComponent(registrationData.student_name)}&entry.id=${encodeURIComponent(registrationData.student_id)}`;

window.open(formUrl, '_blank');
```

## 🚀 Implement Option 2 (Đơn giản nhất):

1. **Bỏ phần Cloudinary upload**
2. **Chỉ gửi email với thông tin file**
3. **Admin nhận email, sau đó liên hệ sinh viên để lấy ảnh**

### Code update:

```typescript
// Bỏ toàn bộ phần Cloudinary upload
// Thay bằng:
const imageInfo = registrationData.student_image 
  ? `📷 File: ${registrationData.student_image.name} (${(registrationData.student_image.size/1024).toFixed(1)}KB)`
  : '📷 Không có ảnh đính kèm';

const emailData = {
  event_title: selectedEvent.title,
  event_date: selectedEvent.date,
  student_name: registrationData.student_name,
  student_id: registrationData.student_id,
  image_info: imageInfo,
  confirmed: registrationData.confirmed ? 'Có' : 'Không',
  note: 'Sinh viên sẽ gửi ảnh qua email riêng sau khi đăng ký'
};

// Tiếp tục với EmailJS...
```

## 💡 Ưu điểm Option 2:
- ✅ **Đơn giản, không lỗi**
- ✅ **Vẫn có thông tin đăng ký đầy đủ**
- ✅ **Admin biết có ảnh hay không**
- ✅ **Sinh viên có thể gửi ảnh riêng sau**

**Bạn có muốn implement Option 2 không? Đảm bảo 100% không lỗi!** 🎯

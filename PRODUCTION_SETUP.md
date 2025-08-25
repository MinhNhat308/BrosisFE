# HƯỚNG DẪN SETUP ĐĂNG KÝ SỰ KIỆN CHO PRODUCTION

## 🔧 CÁC GIẢI PHÁP CHO PRODUCTION

### 📋 Option 1: EmailJS + Cloudinary (KHUYẾN NGHỊ - MIỄN PHÍ)

#### A. Setup Cloudinary (Lưu trữ ảnh)
1. Đăng ký tài khoản miễn phí tại: https://cloudinary.com
2. Lấy thông tin:
   - Cloud Name
   - Upload Preset (tạo unsigned preset)
3. Cập nhật code:
```javascript
const cloudinaryResponse = await fetch(
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
  {
    method: 'POST',
    body: cloudinaryFormData,
  }
);
```

#### B. Setup EmailJS (Gửi email)
1. Đăng ký tại: https://www.emailjs.com
2. Tạo email service
3. Tạo email template với các biến:
   - {{event_title}}
   - {{student_name}} 
   - {{student_id}}
   - {{image_url}}
   - {{registration_date}}
4. Lấy:
   - Service ID
   - Template ID  
   - Public Key
5. Thêm script vào index.html:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
  emailjs.init("YOUR_PUBLIC_KEY");
</script>
```

### 📋 Option 2: Google Forms (ĐỂ DỰ PHÒNG)

1. Tạo Google Form với các trường:
   - Tên sự kiện
   - Họ tên sinh viên
   - Mã số sinh viên
   - Link ảnh (từ Cloudinary)
   - Ngày đăng ký

2. Lấy Form ID và Entry IDs:
   - Form ID: từ URL của form
   - Entry IDs: inspect element các input field

3. Cập nhật URL trong code:
```javascript
const googleFormUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse?entry.123456789=${encodeURIComponent(selectedEvent.title)}&entry.987654321=${encodeURIComponent(registrationData.student_name)}`;
```

### 📋 Option 3: Webhook + Discord/Slack (CHO TEAM)

#### A. Discord Webhook
1. Tạo server Discord
2. Tạo webhook cho channel
3. Gửi thông tin qua webhook:
```javascript
const discordWebhook = "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL";
const payload = {
  embeds: [{
    title: "🎓 Đăng ký sự kiện mới",
    fields: [
      { name: "Sự kiện", value: selectedEvent.title },
      { name: "Sinh viên", value: registrationData.student_name },
      { name: "MSSV", value: registrationData.student_id },
      { name: "Ảnh", value: imageUrl }
    ],
    color: 0x5865F2
  }]
};

await fetch(discordWebhook, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### 📋 Option 4: Firebase (FULL SOLUTION)

1. Setup Firebase project
2. Enable Firestore Database
3. Enable Storage
4. Setup Authentication (optional)

```javascript
// Upload ảnh lên Firebase Storage
const storageRef = ref(storage, `registrations/${studentId}_${Date.now()}`);
const snapshot = await uploadBytes(storageRef, file);
const imageUrl = await getDownloadURL(snapshot.ref);

// Lưu thông tin vào Firestore
await addDoc(collection(db, "registrations"), {
  eventTitle: selectedEvent.title,
  studentName: registrationData.student_name,
  studentId: registrationData.student_id,
  imageUrl: imageUrl,
  registrationDate: new Date(),
  confirmed: registrationData.confirmed
});
```

## 🚀 DEPLOYMENT OPTIONS

### Netlify + Functions
- Deploy frontend lên Netlify
- Sử dụng Netlify Functions cho backend logic
- Connect với external services

### Vercel + API Routes  
- Deploy lên Vercel
- Sử dụng API Routes để xử lý form submission
- Integrate với external services

### Railway/Render + PostgreSQL
- Deploy full-stack app
- Database để lưu thông tin đăng ký
- File storage cho ảnh

## 📧 EMAIL TEMPLATE SAMPLE

```html
<!DOCTYPE html>
<html>
<head>
    <title>Đăng ký sự kiện mới</title>
</head>
<body>
    <h2>🎓 Có đăng ký sự kiện mới!</h2>
    
    <h3>Thông tin sự kiện:</h3>
    <p><strong>Tên sự kiện:</strong> {{event_title}}</p>
    <p><strong>Ngày tổ chức:</strong> {{event_date}}</p>
    <p><strong>Địa điểm:</strong> {{event_location}}</p>
    
    <h3>Thông tin sinh viên:</h3>
    <p><strong>Họ tên:</strong> {{student_name}}</p>
    <p><strong>Mã số sinh viên:</strong> {{student_id}}</p>
    <p><strong>Ngày đăng ký:</strong> {{registration_date}}</p>
    <p><strong>Xác nhận tham gia:</strong> {{confirmed}}</p>
    
    <h3>Ảnh sinh viên:</h3>
    <img src="{{image_url}}" alt="Ảnh sinh viên" style="max-width: 300px;">
    
    <p>Link ảnh: <a href="{{image_url}}">{{image_url}}</a></p>
</body>
</html>
```

## 🔒 BẢO MẬT

1. **Rate limiting**: Giới hạn số lần đăng ký từ 1 IP
2. **File validation**: Kiểm tra loại file và kích thước
3. **Sanitization**: Làm sạch input data
4. **CAPTCHA**: Chống spam và bot

## 💰 CHI PHÍ

- **EmailJS**: 200 emails/tháng miễn phí
- **Cloudinary**: 25GB storage miễn phí  
- **Google Forms**: Hoàn toàn miễn phí
- **Firebase**: Quota miễn phí khá cao
- **Discord/Slack**: Miễn phí

## 🚨 LƯU Ý QUAN TRỌNG

1. **Backup**: Luôn có phương án dự phòng
2. **Testing**: Test kỹ trước khi deploy
3. **Monitoring**: Theo dõi số lượng đăng ký
4. **Privacy**: Tuân thủ quy định về bảo vệ dữ liệu cá nhân
5. **User Experience**: Thông báo rõ ràng cho user về trạng thái đăng ký

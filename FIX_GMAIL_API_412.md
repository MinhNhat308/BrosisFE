# 🔧 FIX LỖI GMAIL API - 412 Insufficient Authentication Scopes

## ❌ Vấn đề hiện tại:
- **Service ID**: Đã fix thành `service_mgmcelk` ✅
- **Gmail API**: "Request had insufficient authentication scopes" ❌

## ✅ Giải pháp fix Gmail API Scopes:

### Bước 1: Reconnect Gmail với permissions đầy đủ
1. **Vào EmailJS Dashboard** → Services
2. **Click vào Gmail service** (`service_mgmcelk`)
3. **Click "Reconnect"** hoặc "Disconnect" rồi connect lại
4. **Khi popup Google hiện ra**, đảm bảo check các permissions:
   - ✅ **Send email on your behalf**
   - ✅ **Read email metadata**
   - ✅ **Manage drafts**
   - ✅ **All Gmail permissions requested**

### Bước 2: Kiểm tra Gmail Settings
1. **Vào Gmail** → Settings (⚙️) → **Forwarding and POP/IMAP**
2. **Enable IMAP** (nếu chưa enable)
3. **Save Changes**

### Bước 3: Google Account Security
1. **Vào Google Account** → Security
2. **2-Step Verification**: Enable (nếu chưa có)
3. **App Passwords**: Tạo app password cho EmailJS (nếu cần)
4. **Less secure app access**: Enable (nếu có option này)

### Bước 4: Test EmailJS
1. **Vào EmailJS Dashboard** → Service `service_mgmcelk`
2. **Click "Send test email"**
3. **Kiểm tra**: Nếu vẫn lỗi 412 → Thực hiện Bước 5

### Bước 5: Alternative - Sử dụng EmailJS SMTP thay vì Gmail API
1. **Tạo service mới** trong EmailJS
2. **Chọn "Other SMTP"** thay vì Gmail
3. **Điền thông tin:**
   ```
   SMTP Server: smtp.gmail.com
   Port: 587
   Username: minhnhat3082001winds@gmail.com
   Password: [App Password từ Google]
   ```
4. **Test connection**

## 🚀 Quick Fix - Disable EmailJS tạm thời:

Nếu không muốn fix Gmail API ngay, có thể tạm thời bỏ qua email:

```typescript
// Trong Events.tsx, comment phần EmailJS:
// await (window as any).emailjs.send(...)

// Thay bằng:
console.log('📧 Email data to send manually:', emailData);
alert(`🎉 Đăng ký thành công! Ảnh đã upload: ${imageUrl}

📧 Thông tin đăng ký:
• Sự kiện: ${selectedEvent.title}
• Họ tên: ${registrationData.student_name}  
• MSSV: ${registrationData.student_id}
• Ảnh: ${imageUrl}

Vui lòng screenshot thông tin này và gửi đến ban tổ chức!`);
```

## 💡 Root Cause:
Gmail API có security restrictions cao hơn. EmailJS cần:
- **Full Gmail API permissions**
- **Proper OAuth2 scopes**
- **Account verification**

## 🎯 Recommendation:
1. **Thử Bước 1-4** trước (reconnect với full permissions)
2. **Nếu vẫn lỗi** → Sử dụng **SMTP method** (Bước 5)
3. **Fallback** → Disable email, chỉ upload ảnh + show info

**Hãy thử reconnect Gmail với full permissions trước!** 🔧

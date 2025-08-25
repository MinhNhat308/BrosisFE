export interface ChatQA {
    question: string[]; // Các cách hỏi
    answer: string;     // Câu trả lời
}

export interface ChatCategory {
    title: string;
    faqs: ChatQA[];
}

export const chatbotData: ChatCategory[] = [
    {
        title: "📚 HỌC TẬP & ĐÀO TẠO (Phòng Quản lý & Tổ chức đào tạo)",
        faqs: [
            {
                question: ["thời khóa biểu", "xem lịch học", "lịch học kỳ"],
                answer: "Bạn có thể xem thời khóa biểu tại hệ thống LMS hoặc cổng thông tin sinh viên (FAP)."
            },
            {
                question: ["add drop", "đăng ký môn", "thêm môn học", "hủy môn"],
                answer: "Giai đoạn add/drop thường diễn ra 2 tuần đầu kỳ. Truy cập FAP để thực hiện."
            },
            {
                question: ["học lại", "học cải thiện", "đăng ký học lại"],
                answer: "Bạn được phép học lại/học cải thiện nếu môn học chưa đạt yêu cầu hoặc muốn nâng điểm."
            },
            {
                question: ["bảo lưu", "nghỉ học tạm thời"],
                answer: "Sinh viên có thể bảo lưu tối đa 1 năm, cần nộp đơn tại Phòng Đào tạo trước kỳ học."
            }
        ]
    },
    {
        title: "📝 KHẢO THÍ (Phòng Khảo thí)",
        faqs: [
            {
                question: ["lịch thi", "thi cuối kỳ", "lịch kiểm tra"],
                answer: "Lịch thi được công bố trên LMS hoặc portal trước ít nhất 2 tuần."
            },
            {
                question: ["phúc khảo", "xin chấm lại", "khiếu nại điểm"],
                answer: "Bạn có thể nộp đơn phúc khảo trong vòng 3 ngày sau khi công bố điểm."
            },
            {
                question: ["thi lại", "đăng ký thi lại"],
                answer: "Thi lại áp dụng cho các môn sinh viên bị điểm F. Lịch thi lại sẽ do phòng Khảo thí thông báo."
            }
        ]
    },
    {
        title: "🏢 DỊCH VỤ SINH VIÊN (SSC)",
        faqs: [
            {
                question: ["giấy xác nhận sinh viên", "xin giấy tờ", "giấy chứng nhận"],
                answer: "Bạn có thể xin giấy tờ tại SSC hoặc đăng ký online trên hệ thống dịch vụ sinh viên."
            },
            {
                question: ["học bổng", "điều kiện học bổng"],
                answer: "FPT có học bổng khuyến khích học tập và hỗ trợ sinh viên khó khăn, liên hệ SSC để biết chi tiết."
            },
            {
                question: ["ký túc xá", "đăng ký ký túc", "kí túc xá"],
                answer: "Ký túc xá FPT được đăng ký qua hệ thống SSC, cần đóng phí trước khi vào ở."
            }
        ]
    },
    {
        title: "📖 THƯ VIỆN",
        faqs: [
            {
                question: ["giờ mở cửa thư viện", "lịch thư viện"],
                answer: "Thư viện mở cửa từ 8:00 - 20:00 (thứ 2 đến thứ 7)."
            },
            {
                question: ["mượn sách", "trả sách", "mất sách"],
                answer: "Sinh viên được mượn tối đa 5 cuốn/2 tuần. Nếu mất sách, bạn cần bồi thường theo quy định."
            },
            {
                question: ["thư viện số", "tài liệu online", "ebook"],
                answer: "Bạn có thể truy cập thư viện số qua tài khoản LMS hoặc cổng thông tin sinh viên."
            }
        ]
    },
    {
        title: "🌍 HỢP TÁC QUỐC TẾ & PHÁT TRIỂN CÁ NHÂN (IC-PDP)",
        faqs: [
            {
                question: ["trao đổi sinh viên", "chương trình trao đổi"],
                answer: "FPT có nhiều chương trình trao đổi tại Nhật, Hàn, Thái Lan... Thông tin tại phòng IC-PDP."
            },
            {
                question: ["du học", "study abroad", "học kỳ quốc tế"],
                answer: "Bạn có thể tham gia học kỳ quốc tế tại các trường đối tác. Điều kiện: GPA >= 2.5 và IELTS 5.5 trở lên."
            },
            {
                question: ["workshop kỹ năng", "phát triển cá nhân"],
                answer: "IC-PDP thường xuyên tổ chức workshop về kỹ năng mềm, lãnh đạo, thuyết trình..."
            }
        ]
    },
    {
        title: "💼 QUAN HỆ DOANH NGHIỆP",
        faqs: [
            {
                question: ["thực tập", "internship"],
                answer: "Sinh viên bắt buộc tham gia kỳ thực tập OJT (On-the-Job Training) trong năm 3-4."
            },
            {
                question: ["việc làm", "tuyển dụng", "job fair"],
                answer: "Phòng QHDN tổ chức ngày hội việc làm thường niên và đăng tin tuyển dụng trên fanpage."
            },
            {
                question: ["hỗ trợ cv", "làm cv", "phỏng vấn"],
                answer: "Bạn có thể tham gia workshop hướng nghiệp hoặc xin tư vấn CV tại phòng QHDN."
            }
        ]
    },
    {
        title: "💻 PHÒNG IT",
        faqs: [
            {
                question: ["quên mật khẩu", "reset mật khẩu", "không đăng nhập được"],
                answer: "Liên hệ IT Helpdesk để reset mật khẩu LMS/portal/email."
            },
            {
                question: ["wifi", "mạng", "sự cố internet"],
                answer: "Nếu gặp sự cố wifi, bạn có thể báo qua hệ thống IT ticket hoặc hotline IT."
            }
        ]
    },
    {
        title: "🏠 CƠ SỞ VẬT CHẤT",
        faqs: [
            {
                question: ["căn tin", "ăn uống"],
                answer: "Căn tin phục vụ từ 6:30 - 19:30, có nhiều món ăn và combo cho sinh viên."
            },
            {
                question: ["phòng tự học", "phòng lab"],
                answer: "Phòng tự học mở cửa 24/7, phòng lab cần đặt lịch trước qua hệ thống."
            },
            {
                question: ["y tế", "bảo hiểm"],
                answer: "Trạm y tế trường hỗ trợ sơ cứu, cấp cứu. Sinh viên bắt buộc tham gia bảo hiểm y tế."
            }
        ]
    },
    {
        title: "📅 SỰ KIỆN & HOẠT ĐỘNG",
        faqs: [
            {
                question: ["clb", "câu lạc bộ", "hoạt động ngoại khóa"],
                answer: "Trường có hơn 50 CLB về học thuật, nghệ thuật, thể thao... Bạn có thể đăng ký tham gia đầu kỳ."
            },
            {
                question: ["workshop", "seminar"],
                answer: "Lịch workshop và seminar sẽ được thông báo trên fanpage và email sinh viên."
            }
        ]
    },
    {
        title: "❓ FAQ",
        faqs: [
            {
                question: ["chuyển cơ sở", "học ở cơ sở khác"],
                answer: "Bạn cần đăng ký trước ít nhất 4 tuần tại phòng Đào tạo để chuyển cơ sở học."
            },
            {
                question: ["hotline", "số điện thoại liên hệ"],
                answer: "Bạn có thể liên hệ hotline SSC: 024-7300-5588 hoặc phòng ban liên quan."
            }
        ]
    }
];

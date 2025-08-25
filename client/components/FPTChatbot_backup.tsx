// Backup of enhanced FPT Chatbot - Full version
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import './chatbot-scroll.css';

import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Bot,
  User,
  Search,
  Globe,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'warning' | 'info' | 'success' | 'research';
  isResearching?: boolean;
}

interface ResearchResult {
  source: string;
  content: string;
  url?: string;
}

interface FPTKnowledgeBase {
  categories: {
    general: string[];
    academic: string[];
    campus: string[];
    admission: string[];
    services: string[];
    studyManagement: string[];
    examination: string[];
    administrativeServices: string[];
    library: string[];
    internationalCooperation: string[];
    careerServices: string[];
    itSupport: string[];
    facilityServices: string[];
    eventsActivities: string[];
    quickFAQ: string[];
    healthCommunity: string[];
  };
}

export default function FPTChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Xin chào! Tôi là FPT Assistant. Tôi có thể giúp bạn tìm hiểu về FPT University. Hãy hỏi tôi bất cứ điều gì!',
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FPT Knowledge Base - Enhanced with comprehensive services
  const fptKnowledge: FPTKnowledgeBase = {
    categories: {
      general: [
        'FPT University được thành lập năm 2006',
        'FPT là trường đại học tư thục hàng đầu về công nghệ',
        'FPT có các cơ sở tại Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Quy Nhon',
        'FPT nổi tiếng với chương trình đào tạo thực tế, sát với doanh nghiệp',
        'Phương pháp học: Project-based learning, thực hành 70% - lý thuyết 30%',
        'Công nghệ hiện đại: AI Lab, Blockchain Center, IoT Lab, Cloud Computing',
        'Đối tác công nghệ: Microsoft, Google, AWS, IBM, Oracle',
        'Học theo mô hình Capstone Project - làm dự án thực tế cho doanh nghiệp'
      ],
      academic: [
        'Các ngành: Công nghệ thông tin, Kinh doanh, Thiết kế đồ họa, Marketing Digital',
        'Học phí khoảng 30-35 triệu/năm tùy ngành',
        'Thời gian đào tạo: 4 năm cho bằng cử nhân',
        'Có chương trình liên kết quốc tế với nhiều trường đại học uy tín',
        'Chuyên ngành IT: Software Engineering, AI, Cybersecurity, Mobile App, Web Development',
        'Curriculum cập nhật theo xu hướng: React, Node.js, Python, Java, C#, Flutter',
        'Thực tập bắt buộc tại các công ty công nghệ hàng đầu',
        'Tỷ lệ có việc làm sau tốt nghiệp: 95% trong vòng 6 tháng'
      ],
      campus: [
        'Cơ sở Hà Nội: Khu công nghệ cao Hòa Lạc',
        'Cơ sở TP.HCM: Quận 9, TP. Thủ Đức',
        'Cơ sở Đà Nẵng: Khu công nghệ cao Đà Nẵng',
        'Tất cả cơ sở đều có đầy đủ trang thiết bị hiện đại',
        'Lab máy tính cấu hình cao: Core i7, 16GB RAM, SSD, card đồ họa',
        'WiFi tốc độ cao, hệ thống điều hòa hiện đại',
        'Không gian học tập mở, coworking space, gaming zone'
      ],
      admission: [
        'Xét tuyển dựa trên điểm thi THPT hoặc học bạ',
        'Có xét tuyển riêng cho các ngành thiết kế',
        'Thời gian tuyển sinh: từ tháng 3 đến tháng 8 hàng năm',
        'Hỗ trợ học bổng cho sinh viên xuất sắc'
      ],
      services: [
        'Ký túc xá hiện đại với đầy đủ tiện nghi',
        'Thư viện điện tử với hàng nghìn tài liệu',
        'Phòng gym, sân thể thao, câu lạc bộ sinh viên',
        'Hỗ trợ việc làm và thực tập tại các công ty đối tác',
        'Career Center: Tư vấn nghề nghiệp, CV, phỏng vấn',
        'FPT Software, FPT Telecom tuyển dụng ưu tiên sinh viên FPT',
        'Startup Incubator: Hỗ trợ khởi nghiệp cho sinh viên'
      ],
      studyManagement: [
        'Thời khóa biểu: Tra cứu trên LMS/Portal, cập nhật realtime',
        'Đăng ký môn học: Mỗi kỳ có thời gian đăng ký riêng (thường 1-2 tuần)',
        'Add/Drop môn: Được phép thay đổi trong 2 tuần đầu học kỳ',
        'Học lại: Đăng ký học lại môn điểm F hoặc muốn cải thiện điểm',
        'Bảo lưu: Tạm ngừng học tối đa 2 năm với lý do chính đáng',
        'Chuyển ngành: Thực hiện sau kỳ 1, cần đạt GPA ≥ 2.5',
        'Quy chế tín chỉ: Tối thiểu 140 tín chỉ để tốt nghiệp',
        'Điều kiện tốt nghiệp: GPA ≥ 2.0, hoàn thành đồ án tốt nghiệp'
      ],
      examination: [
        'Lịch thi: Công bố trước 2 tuần, tra cứu trên LMS',
        'Quy chế thi: 60 phút/môn lý thuyết, 90-120 phút/môn thực hành',
        'Thi lại: Tối đa 3 lần/môn, học phí 500k/lần thi',
        'Phúc khảo: Nộp đơn trong 7 ngày sau công bố điểm',
        'Công bố điểm: Sau 7-10 ngày làm bài, GPA cập nhật cuối kỳ',
        'Hình thức thi: Trắc nghiệm + tự luận, một số môn thi thực hành',
        'Điểm danh: Bắt buộc 80% buổi học để được dự thi',
        'Quy định chuyên cần: Vắng quá 20% sẽ không được thi'
      ],
      administrativeServices: [
        'Giấy xác nhận sinh viên: 3-5 ngày làm việc, phí 20k/bản',
        'Bảng điểm: Bản chính 50k, bản photo công chứng 30k',
        'Đơn xin nghỉ học: Nộp trước 30 ngày, được hoàn học phí theo quy định',
        'Thẻ sinh viên: Làm mới 100k, làm lại khi mất 150k',
        'Chuyển cơ sở: Đăng ký trước 1 tháng, điều kiện GPA ≥ 2.0',
        'Đổi mật khẩu email: Qua portal hoặc liên hệ IT Helpdesk',
        'Reset tài khoản LMS: Liên hệ phòng đào tạo hoặc IT',
        'Chính sách học bổng: Dựa trên GPA và hoàn cảnh gia đình'
      ],
      library: [
        'Giờ mở cửa: 7:00-22:00 (T2-T6), 8:00-20:00 (T7-CN)',
        'Mượn sách: Tối đa 5 cuốn/lần, thời hạn 14 ngày',
        'Thư viện số: Truy cập 24/7 qua tài khoản sinh viên',
        'Phòng học nhóm: Đặt trước qua hệ thống online',
        'Tài liệu nghiên cứu: IEEE, ACM, SpringerLink miễn phí',
        'Photocopy: 200đ/trang A4, 300đ/trang A3',
        'Tra cứu sách: Hệ thống catalog online',
        'Phạt trễ hạn: 2000đ/ngày/cuốn sách'
      ],
      internationalCooperation: [
        'Chương trình trao đổi: 1 kỳ tại đại học đối tác',
        'Du học ngắn hạn: Summer course 2-4 tuần',
        'Workshop quốc tế: Kỹ năng mềm, chuyên môn',
        'Học bổng quốc tế: 50-100% chi phí du học',
        'Chứng chỉ quốc tế: Cisco, Microsoft, AWS, Google',
        'Đối tác: Đại học Úc, Canada, Singapore, Nhật Bản',
        'English Environment: 30% môn học bằng tiếng Anh',
        'IELTS Center: Luyện thi và thi IELTS tại trường'
      ],
      careerServices: [
        'Thực tập: Bắt buộc 4 tháng từ kỳ 7, có lương',
        'Career Center: Tư vấn CV, phỏng vấn, định hướng nghề nghiệp',
        'Job Fair: 2 lần/năm với 200+ doanh nghiệp tham gia',
        'Workshop kỹ năng: Presentation, teamwork, leadership',
        'Mạng lưới alumni: 50,000+ cựu sinh viên hỗ trợ',
        'Mentorship Program: Kết nối với senior trong ngành',
        'Startup Incubator: Hỗ trợ khởi nghiệp, đầu tư seed funding',
        'Cơ hội việc làm: 95% sinh viên có việc trong 6 tháng'
      ],
      itSupport: [
        'Tài khoản LMS: Kích hoạt trong 3 ngày sau nhập học',
        'Email sinh viên: Định dạng ten@fpt.edu.vn, dung lượng 50GB',
        'Đổi mật khẩu: Qua portal hoặc liên hệ IT Helpdesk',
        'WiFi campus: Tốc độ 100Mbps, phủ sóng toàn trường',
        'Hỗ trợ kỹ thuật: 8:00-17:00 hàng ngày, hotline 1900-6936',
        'Portal MyFPT: Tra cứu điểm, lịch học, thông báo',
        'Microsoft Office 365: Miễn phí cho sinh viên',
        'Cloud Storage: OneDrive 1TB cho mỗi sinh viên'
      ],
      facilityServices: [
        'Phòng học: 500+ phòng có máy chiếu, điều hòa',
        'Phòng lab: Chuyên biệt cho từng ngành (AI, IoT, Game)',
        'Phòng tự học: 24/7 với hệ thống thẻ từ',
        'Căn tin: 5 tầng với 30+ quầy đa dạng món ăn',
        'Bãi xe: Miễn phí cho xe đạp, xe máy 5k/ngày',
        'ATM: Vietcombank, Techcombank, BIDV trong campus',
        'Y tế học đường: Phòng khám, thuốc men cơ bản',
        'Khu thể thao: Sân bóng đá, bóng rổ, tennis, gym'
      ],
      eventsActivities: [
        'Lịch học kỳ: 2 kỳ chính + 1 kỳ hè, mỗi kỳ 15 tuần',
        'Workshop hàng tuần: Công nghệ mới, kỹ năng mềm',
        'Seminar chuyên ngành: Mời diễn giả từ doanh nghiệp',
        'CLB sinh viên: 50+ CLB về công nghệ, thể thao, văn hóa',
        'Hackathon: Thi lập trình 48h, giải thưởng đến 100 triệu',
        'Tech Talk: Chia sẻ từ các chuyên gia công nghệ',
        'Ngày hội việc làm: Kết nối sinh viên với nhà tuyển dụng',
        'Festival: FPT Fest, ngày hội sáng tạo, triển lãm'
      ],
      quickFAQ: [
        'Đăng nhập LMS: Dùng mã sinh viên + mật khẩu được cấp',
        'Quên mật khẩu: Liên hệ IT Helpdesk hoặc reset qua email',
        'Hotline khẩn cấp: 1900-6936 (24/7)',
        'Phòng đào tạo: Tầng 3 tòa Alpha, giờ hành chính',
        'Phòng CTSV: Tầng 2 tòa Alpha, 8:00-17:00',
        'Cách đăng ký ký túc xá: Qua portal, nộp hồ sơ trước kỳ học',
        'Thủ tục chuyển cơ sở: Điền đơn, nộp phòng đào tạo',
        'Kênh hỗ trợ: Fanpage, Zalo Official, email support'
      ],
      healthCommunity: [
        'Y tế học đường: Bác sĩ, y tá thường trực 8:00-17:00',
        'Bảo hiểm y tế: Tham gia BHYT sinh viên 660k/năm',
        'Tư vấn tâm lý: Miễn phí cho sinh viên, đặt lịch trước',
        'Mentoring: Sinh viên năm cuối hỗ trợ tân sinh viên',
        'Campus tour: Hướng dẫn làm quen môi trường học tập',
        'CLB thể thao: Bóng đá, bóng rổ, cầu lông, yoga',
        'Hoạt động tình nguyện: Mùa hè xanh, hiến máu',
        'Checklist tân sinh viên: Làm thẻ, kích hoạt tài khoản, tham gia orientation'
      ]
    }
  };

  // Bad words filter
  const badWords = [
    'đm', 'dm', 'fuck', 'shit', 'vcl', 'vkl', 'clm', 'cmm', 'cc', 'đcm',
    'đít', 'lồn', 'cặc', 'buồi', 'chó', 'súc vật', 'đụ', 'địt'
  ];

  // Validate message
  const validateMessage = (message: string): { isValid: boolean; reason?: string } => {
    const trimmed = message.trim();
    
    // Check minimum length
    if (trimmed.length < 2) {
      return { isValid: false, reason: 'Tin nhắn quá ngắn. Vui lòng nhập ít nhất 2 ký tự.' };
    }

    // Check for repeated characters (like "aaaaaaa")
    if (/(.)\1{4,}/.test(trimmed)) {
      return { isValid: false, reason: 'Vui lòng không gửi tin nhắn spam hoặc ký tự lặp lại.' };
    }

    // Check for bad words
    const lowerMessage = trimmed.toLowerCase();
    const containsBadWord = badWords.some(word => lowerMessage.includes(word));
    if (containsBadWord) {
      return { isValid: false, reason: 'Tin nhắn chứa từ ngữ không phù hợp. Vui lòng sử dụng ngôn từ lịch sự.' };
    }

    // Check if message is just numbers or special characters
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(trimmed)) {
      return { isValid: false, reason: 'Vui lòng nhập tin nhắn có ý nghĩa.' };
    }

    return { isValid: true };
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] shadow-xl border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold text-sm">FPT Assistant</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-200">Online</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 h-7 w-7 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-7 w-7 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 h-[430px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 chatbot-scroll">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : message.type === 'warning' 
                          ? 'bg-red-500' 
                          : message.type === 'research'
                            ? 'bg-green-500'
                            : 'bg-purple-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : message.type === 'research' ? (
                        <Search className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`p-3 rounded-lg text-sm message-scroll ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white ml-auto'
                            : message.type === 'warning'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : message.type === 'research'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800'
                        } ${message.text.length > 300 ? 'max-h-40 overflow-y-auto' : ''}`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.text}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Hỏi tôi về FPT University..."
                    className="flex-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // handleSendMessage();
                      }
                    }}
                    disabled={isTyping || isResearching}
                  />
                  <Button
                    // onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping || isResearching}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isResearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-2 mt-2 max-h-16 overflow-y-auto">
                  {['Học phí mới nhất', 'Tuyển sinh 2025', 'Cơ sở FPT', 'Tư vấn laptop'].map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors text-xs flex-shrink-0"
                      onClick={() => setInputValue(suggestion)}
                    >
                      {suggestion.includes('mới nhất') || suggestion.includes('laptop') ? (
                        <Search className="w-3 h-3 mr-1" />
                      ) : null}
                      {suggestion}
                    </Badge>
                  ))}
                </div>
                
                {/* Scroll helper text */}
                <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center space-x-2">
                  <span>💡 Cuộn chuột để xem tin nhắn cũ</span>
                  <span>•</span>
                  <span>📜 Tin nhắn dài có thể cuộn riêng</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

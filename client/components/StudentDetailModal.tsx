import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "../services/config";
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  Code, 
  FileText, 
  Trophy, 
  BookOpen, 
  Award, 
  Star, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download 
} from "lucide-react";

interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  department: string;
  contact_status: string;
  insurance_status: string;
  address?: string;
  notes?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  event_participations?: RegisteredEvent[];
  document_submissions?: any[];
}

interface RegisteredEvent {
  id: number;
  student_id: string;
  event_id: number;
  registered_at: string;
  participation_status?: string;
  event: {
    id: number;
    title: string;
    start_date: string;
    status: string;
    location?: string;
  };
}

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  const [checkedDocuments, setCheckedDocuments] = useState<{ [key: string]: boolean }>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isUpdatingDocument, setIsUpdatingDocument] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (student && isOpen) {
      fetchStudentDocuments();
    }
  }, [student, isOpen]);

  const fetchStudentDocuments = async () => {
    if (!student) return;
    
    setIsLoadingDocuments(true);
    try {
      // First try to get existing documents
      let response = await fetch(`${API_BASE_URL}/api/documents/student/${student.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      let result = await response.json();
      
      // If no documents exist, create default ones
      if (!result.data || result.data.length === 0) {
        const createResponse = await fetch(`${API_BASE_URL}/api/documents/student/${student.id}/create-defaults`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (createResponse.ok) {
          const createResult = await createResponse.json();
          setDocuments(createResult.data || []);
        }
      } else {
        setDocuments(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Fallback to mock data if API fails
      setDocuments([
        { id: 1, document_name: "Hồ sơ nhập học", submission_status: "not_submitted", is_required: true, deadline: "2024-08-15", submitted_at: null },
        { id: 2, document_name: "Giấy khám sức khỏe", submission_status: "not_submitted", is_required: true, deadline: "2024-08-30", submitted_at: null },
        { id: 3, document_name: "Đơn xin học bổng", submission_status: "not_submitted", is_required: false, deadline: "2024-09-01", submitted_at: null },
        { id: 4, document_name: "Bảo hiểm Y tế", submission_status: "not_submitted", is_required: true, deadline: "2024-09-15", submitted_at: null }
      ]);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleDocumentStatusUpdate = async (documentId: number, newStatus: string) => {
    setIsUpdatingDocument(prev => ({ ...prev, [documentId]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_status: newStatus,
          notes: `Cập nhật bởi admin vào ${new Date().toLocaleString('vi-VN')}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      const result = await response.json();
      
      // Update local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, submission_status: newStatus, submitted_at: newStatus === 'submitted' ? new Date().toISOString() : doc.submitted_at }
            : doc
        )
      );

      alert(`✅ Đã cập nhật trạng thái tài liệu thành: ${newStatus === 'submitted' ? 'Đã nộp' : 'Chưa nộp'}`);
      
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('❌ Có lỗi xảy ra khi cập nhật trạng thái tài liệu');
    } finally {
      setIsUpdatingDocument(prev => ({ ...prev, [documentId]: false }));
    }
  };

  if (!student) return null;

  // Mock data for display purposes (combining real data with mock for complete UI)
  const mockSkills = ["React", "JavaScript", "Node.js", "TypeScript", "Database"];
  const mockAchievements = ["Excellent Student", "Perfect Attendance", "Best Project Award"];
  const mockCompletionRate = Math.floor(Math.random() * 30) + 70;

  const getDocumentStatus = (submission_status: string, is_required: boolean) => {
    switch (submission_status) {
      case 'submitted':
      case 'approved':
        return { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle };
      case 'pending_review':
        return { color: "text-blue-600", bg: "bg-blue-100", icon: Clock };
      case 'rejected':
        return { color: "text-red-600", bg: "bg-red-100", icon: XCircle };
      default: // not_submitted
        return is_required 
          ? { color: "text-red-600", bg: "bg-red-100", icon: XCircle }
          : { color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock };
    }
  };

  const getStatusText = (submission_status: string) => {
    switch (submission_status) {
      case 'submitted': return 'Đã nộp';
      case 'approved': return 'Đã duyệt';
      case 'pending_review': return 'Đang xem xét';
      case 'rejected': return 'Bị từ chối';
      default: return 'Chưa nộp';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={student.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white text-xl">
                {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl text-foreground">{student.name}</DialogTitle>
              <DialogDescription className="text-lg">
                {student.department}
              </DialogDescription>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-unicorn-pink text-white">ID: {student.student_id}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-unicorn-pink data-[state=active]:text-white">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-unicorn-pink data-[state=active]:text-white">
              Sự kiện
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-unicorn-pink data-[state=active]:text-white">
              Hồ sơ
            </TabsTrigger>
          </TabsList>

          <div className="h-[500px] overflow-y-auto pr-4">
            <TabsContent value="overview" className="space-y-6">
              {/* Contact Information */}
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-unicorn-pink" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-unicorn-pink" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-unicorn-pink" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-unicorn-pink" />
                    <span className="text-sm">Tham gia: {new Date(student.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-unicorn-pink" />
                    Tiến độ học tập
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tỷ lệ hoàn thành bài tập</span>
                      <span className="font-medium text-unicorn-pink">{mockCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-3 rounded-full transition-all duration-300"
                        style={{ width: `${mockCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-unicorn-purple">
                        {student.event_participations?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Sự kiện tham gia</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {student.document_submissions?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Số lượng Hồ sơ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-unicorn-pink" />
                    Kỹ năng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockSkills.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-unicorn-pink/10 text-unicorn-pink">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-unicorn-pink" />
                    Lịch sử tham gia sự kiện
                  </CardTitle>
                  <CardDescription>
                    Danh sách các sự kiện mà {student.name} đã tham gia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.event_participations && student.event_participations.length > 0 ? (
                      student.event_participations.map((participation: any, index: number) => (
                        <div key={index} className="p-4 rounded-lg border border-unicorn-pink/20 bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-4 h-4 rounded-full mt-1 ${
                                participation.participation_status === 'attended' ? 'bg-green-500' :
                                participation.participation_status === 'registered' ? 'bg-blue-500' :
                                participation.participation_status === 'absent' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-lg">{participation.event?.title || "Sự kiện không xác định"}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {participation.event?.status || 'unknown'}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {participation.event?.start_date 
                                      ? new Date(participation.event.start_date).toLocaleDateString('vi-VN')
                                      : "Chưa có ngày"
                                    }
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Đăng ký: {new Date(participation.registered_at).toLocaleDateString('vi-VN')}
                                  </div>
                                  {participation.event?.location && (
                                    <div className="flex items-center gap-1 col-span-2">
                                      <Trophy className="w-4 h-4" />
                                      {participation.event.location}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge className={
                                    participation.participation_status === 'attended' ? "bg-green-500 text-white" :
                                    participation.participation_status === 'registered' ? "bg-blue-500 text-white" :
                                    participation.participation_status === 'absent' ? "bg-red-500 text-white" :
                                    "bg-yellow-500 text-white"
                                  }>
                                    {participation.participation_status === 'attended' ? "✓ Đã tham gia" :
                                     participation.participation_status === 'registered' ? "📝 Đã đăng ký" :
                                     participation.participation_status === 'absent' ? "✗ Vắng mặt" :
                                     "⏳ Chờ xác nhận"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  // TODO: Show registration details
                                  alert(`Chi tiết đăng ký sự kiện: ${participation.event?.title}\nTrạng thái: ${participation.participation_status}\nĐăng ký lúc: ${new Date(participation.registered_at).toLocaleString('vi-VN')}`);
                                }}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Chi tiết
                              </Button>
                              
                              <Button 
                                size="sm"
                                variant={participation.participation_status === 'attended' ? "default" : "secondary"}
                                className={`text-xs ${
                                  participation.participation_status === 'attended' 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : participation.participation_status === 'registered'
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                                onClick={() => {
                                  // TODO: Update participation status
                                  const newStatus = participation.participation_status === 'attended' ? 'absent' : 'attended';
                                  alert(`Cập nhật trạng thái thành: ${newStatus === 'attended' ? 'Đã tham gia' : 'Vắng mặt'}`);
                                }}
                              >
                                {participation.participation_status === 'attended' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Hoàn thành
                                  </>
                                ) : participation.participation_status === 'registered' ? (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Chờ điểm danh
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Vắng mặt
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground text-lg">
                          Sinh viên chưa đăng ký sự kiện nào
                        </p>
                        <p className="text-center text-muted-foreground text-sm mt-2">
                          Khuyến khích {student.name} tham gia các hoạt động của trường
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-unicorn-pink" />
                    Hồ sơ và tài liệu
                  </CardTitle>
                  <CardDescription>
                    Quản lý trạng thái nộp hồ sơ của sinh viên
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDocuments ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-unicorn-pink border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-muted-foreground">Đang tải hồ sơ...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((doc: any) => {
                        const status = getDocumentStatus(doc.submission_status, doc.is_required);
                        const StatusIcon = status.icon;
                        const isUpdating = isUpdatingDocument[doc.id] || false;

                        return (
                          <div key={doc.id} className="p-4 rounded-lg border border-unicorn-pink/20 bg-gradient-to-r from-white to-unicorn-pink/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <StatusIcon className={`w-5 h-5 ${status.color}`} />
                                <div>
                                  <p className="font-medium text-foreground">{doc.document_name}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Hạn: {new Date(doc.deadline).toLocaleDateString('vi-VN')}</span>
                                    {doc.is_required && (
                                      <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                                        Bắt buộc
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={`${status.bg} ${status.color} border-0`}>
                                  {getStatusText(doc.submission_status)}
                                </Badge>
                                {doc.submission_status === 'submitted' && doc.submitted_at && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(doc.submitted_at).toLocaleDateString('vi-VN')}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                onClick={() => handleDocumentStatusUpdate(doc.id, doc.submission_status === 'submitted' ? 'not_submitted' : 'submitted')}
                                disabled={isUpdating}
                                variant={doc.submission_status === 'submitted' ? 'outline' : 'default'}
                                className={doc.submission_status === 'submitted' 
                                  ? 'border-red-500 text-red-600 hover:bg-red-50' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                                }
                                size="sm"
                              >
                                {isUpdating ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                    Đang cập nhật...
                                  </div>
                                ) : doc.submission_status === 'submitted' ? (
                                  '❌ Đánh dấu chưa nộp'
                                ) : (
                                  '✅ Đánh dấu đã nộp'
                                )}
                              </Button>
                              
                              {doc.submission_status === 'submitted' && (
                                <Button variant="ghost" size="sm" className="p-2 h-auto text-unicorn-pink hover:bg-unicorn-pink/10">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      
                      {documents.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-unicorn-pink/50" />
                          <p>Chưa có hồ sơ nào được tạo</p>
                          <Button 
                            onClick={fetchStudentDocuments}
                            className="mt-3 bg-unicorn-pink hover:bg-unicorn-pink-dark text-white"
                          >
                            Tạo hồ sơ mặc định
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">Hướng dẫn sử dụng:</p>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Nhấn <strong>"✅ Đánh dấu đã nộp"</strong> khi sinh viên đã nộp tài liệu</li>
                          <li>• Nhấn <strong>"❌ Đánh dấu chưa nộp"</strong> để hoàn tác nếu cần</li>
                          <li>• Hệ thống sẽ tự động lưu thời gian cập nhật vào database</li>
                          <li>• Các tài liệu có nhãn <span className="text-red-600 font-medium">"Bắt buộc"</span> cần được nộp đầy đủ</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-amber-600 mt-0.5">📋</div>
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 mb-2">Quy định hồ sơ nhập học - Trường Đại học FPT:</p>
                        <div className="text-amber-700 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-medium mb-1">📄 Tài liệu bắt buộc:</p>
                              <ul className="space-y-1 ml-2">
                                <li>• 02 bản gốc Biên nhận nhập học (theo mẫu FPT)</li>
                                <li>• 01 bản gốc Phiếu nhập học (theo mẫu FPT)</li>
                                <li>• 01 bản sao công chứng Học bạ THPT đủ 3 năm</li>
                                <li>• 01 bản sao công chứng Bằng tốt nghiệp THPT</li>
                                <li>• 01 bản sao công chứng Căn cước/CCCD</li>
                                <li>• 01 bản sao công chứng Giấy khai sinh</li>
                                <li>• 01 ảnh 3×4 (trong phong bì có ghi thông tin)</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium mb-1">📝 Tài liệu tùy theo phương thức xét tuyển:</p>
                              <ul className="space-y-1 ml-2">
                                <li>• Giấy chứng nhận SchoolRank (nếu xét SchoolRank)</li>
                                <li>• Kết quả thi THPT 2025 (nếu dùng điểm 2025)</li>
                                <li>• Kết quả thi các năm trước (nếu dùng điểm cũ)</li>
                                <li>• Kết quả thi đánh giá năng lực ĐHQG</li>
                                <li>• Đơn ưu tiên (thế hệ 1)</li>
                                <li>• Giấy tờ xét tuyển thẳng</li>
                                <li>• Chứng chỉ chương trình đặc biệt</li>
                                <li>• Chứng chỉ tiếng Anh quốc tế</li>
                              </ul>
                            </div>
                          </div>
                          <p className="text-xs italic text-amber-600 mt-2">
                            ⚠️ <strong>Lưu ý:</strong> Nếu chưa có Bằng tốt nghiệp THPT, nộp Giấy chứng nhận tạm thời và bổ sung Bằng trong vòng 1 năm.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button className="bg-unicorn-pink hover:bg-unicorn-pink-dark text-white">
            Chỉnh sửa thông tin
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

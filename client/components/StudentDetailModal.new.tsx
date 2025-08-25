import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  School,
  Calendar,
  FileText,
  UserCheck,
  Users,
  Shield
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
  event_participations?: any[];
  document_submissions?: any[];
}

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  if (!student) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "no_response":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "contacted":
        return "Đã liên hệ";
      case "pending":
        return "Chờ liên hệ";
      case "no_response":
        return "Không phản hồi";
      case "active":
        return "Đang hoạt động";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar_url || ""} />
              <AvatarFallback className="bg-unicorn-purple/10 text-unicorn-purple">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.student_id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sự kiện
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
          </TabsList>

          {/* Tab Thông tin */}
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{student.department}</span>
                  </div>
                  {student.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Thông tin phụ huynh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {student.parent_name ? (
                    <>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.parent_name}</span>
                      </div>
                      {student.parent_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.parent_phone}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Chưa có thông tin phụ huynh</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Trạng thái liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(student.contact_status)}>
                    {getStatusText(student.contact_status)}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bảo hiểm Y tế
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(student.insurance_status)}>
                    {getStatusText(student.insurance_status)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {student.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{student.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Sự kiện */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử tham gia sự kiện</CardTitle>
                <CardDescription>
                  Danh sách các sự kiện mà sinh viên đã đăng ký hoặc tham gia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {student.event_participations && student.event_participations.length > 0 ? (
                  <div className="space-y-3">
                    {student.event_participations.map((participation, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {participation.event?.title || "Sự kiện không xác định"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {participation.event?.start_date 
                                ? new Date(participation.event.start_date).toLocaleDateString('vi-VN')
                                : "Chưa có ngày"
                              }
                            </p>
                          </div>
                          <Badge 
                            className={
                              participation.participation_status === 'attended' 
                                ? 'bg-green-100 text-green-800'
                                : participation.participation_status === 'registered'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {participation.participation_status === 'attended' && 'Đã tham gia'}
                            {participation.participation_status === 'registered' && 'Đã đăng ký'}
                            {participation.participation_status === 'absent' && 'Vắng mặt'}
                            {participation.participation_status === 'not_registered' && 'Chưa đăng ký'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Sinh viên chưa tham gia sự kiện nào
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Hồ sơ */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hồ sơ và tài liệu</CardTitle>
                <CardDescription>
                  Danh sách các tài liệu cần nộp và trạng thái nộp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {student.document_submissions && student.document_submissions.length > 0 ? (
                  <div className="space-y-3">
                    {student.document_submissions.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{doc.document_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Loại: {doc.document_type}
                            </p>
                            {doc.deadline && (
                              <p className="text-sm text-muted-foreground">
                                Hạn nộp: {new Date(doc.deadline).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.is_required && (
                              <Badge variant="destructive" className="text-xs">
                                Bắt buộc
                              </Badge>
                            )}
                            <Badge 
                              className={
                                doc.submission_status === 'submitted' 
                                  ? 'bg-green-100 text-green-800'
                                  : doc.submission_status === 'pending_review'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {doc.submission_status === 'submitted' && 'Đã nộp'}
                              {doc.submission_status === 'pending_review' && 'Đang xét duyệt'}
                              {doc.submission_status === 'not_submitted' && 'Chưa nộp'}
                              {doc.submission_status === 'approved' && 'Đã duyệt'}
                              {doc.submission_status === 'rejected' && 'Bị từ chối'}
                            </Badge>
                          </div>
                        </div>
                        {doc.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{doc.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Sinh viên chưa có hồ sơ nào
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

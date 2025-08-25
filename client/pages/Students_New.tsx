import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  X,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  AlertCircle
} from "lucide-react";
import { 
  mockStudents, 
  mockEvents, 
  documentTypes, 
  generateEventParticipations, 
  generateDocumentSubmissions 
} from "@/services/mockData";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students] = useState(mockStudents);
  const [eventParticipations] = useState(generateEventParticipations());
  const [documentSubmissions] = useState(generateDocumentSubmissions());
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge className="bg-green-100 text-green-800">Đã tham gia</Badge>;
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Đã đăng ký</Badge>;
      case "excuse":
        return <Badge className="bg-yellow-100 text-yellow-800">Xin vắng</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Vắng mặt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa đăng ký</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800">Đã nộp</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Chưa nộp</Badge>;
    }
  };

  const getContactStatusBadge = (status: string) => {
    switch (status) {
      case "contacted":
        return <Badge className="bg-green-100 text-green-800">Đã liên hệ</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ liên hệ</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Không phản hồi</Badge>;
    }
  };

  const getInsuranceStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Còn hiệu lực</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>;
    }
  };

  const handleViewRegistration = (student: any, event: any, participation: any) => {
    setSelectedRegistration({
      student,
      event,
      participation
    });
    setIsRegistrationModalOpen(true);
  };

  // Calculate statistics
  const totalStudents = students.length;
  const contactedStudents = students.filter(s => s.contact_status === 'contacted').length;
  const activeInsurance = students.filter(s => s.insurance_status === 'active').length;
  const totalEventParticipations = eventParticipations.filter(p => p.participation_status !== 'not_registered').length;
  const totalDocumentSubmissions = documentSubmissions.filter(d => d.submission_status === 'submitted').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sinh viên</h1>
          <p className="text-gray-600 mt-1">Theo dõi thông tin 20 sinh viên</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sinh viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Sinh viên quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã liên hệ</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactedStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((contactedStudents / totalStudents) * 100)}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bảo hiểm hiệu lực</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInsurance}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeInsurance / totalStudents) * 100)}% có BHYT
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tham gia sự kiện</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventParticipations}</div>
            <p className="text-xs text-muted-foreground">Lượt tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hồ sơ đã nộp</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocumentSubmissions}</div>
            <p className="text-xs text-muted-foreground">Tài liệu nộp</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Danh sách Sinh viên</TabsTrigger>
          <TabsTrigger value="events">Bảng Sự kiện</TabsTrigger>
          <TabsTrigger value="documents">Bảng Hồ sơ</TabsTrigger>
        </TabsList>

        {/* Students List Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách 20 Sinh viên</CardTitle>
              <CardDescription>
                Thông tin cơ bản và trạng thái của từng sinh viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MSSV</TableHead>
                    <TableHead>Tên sinh viên</TableHead>
                    <TableHead>Khoa</TableHead>
                    <TableHead>Tên phụ huynh</TableHead>
                    <TableHead>SĐT phụ huynh</TableHead>
                    <TableHead>Trạng thái liên hệ</TableHead>
                    <TableHead>Trạng thái BHYT</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.student_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.parent_name}</TableCell>
                      <TableCell>{student.parent_phone}</TableCell>
                      <TableCell>{getContactStatusBadge(student.contact_status)}</TableCell>
                      <TableCell>{getInsuranceStatusBadge(student.insurance_status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{student.address}</TableCell>
                      <TableCell className="max-w-xs truncate">{student.notes}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Bảng Sự kiện tham gia</CardTitle>
              <CardDescription>
                Theo dõi tham gia sự kiện của từng sinh viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinh viên</TableHead>
                    {mockEvents.map(event => (
                      <TableHead key={event.id} className="text-center">
                        <div className="space-y-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-gray-500">{event.date}</div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.student_id}</div>
                        </div>
                      </TableCell>
                      {mockEvents.map(event => {
                        const participation = eventParticipations.find(
                          p => p.student_id === student.id && p.event_id === event.id
                        );
                        return (
                          <TableCell key={event.id} className="text-center">
                            <div className="space-y-1">
                              {getEventStatusBadge(participation?.participation_status || 'not_registered')}
                              {participation && participation.participation_status !== 'not_registered' && (
                                <div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewRegistration(student, event, participation)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Xem
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Bảng Hồ sơ đã nộp</CardTitle>
              <CardDescription>
                Theo dõi trạng thái nộp hồ sơ của từng sinh viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sinh viên</TableHead>
                    {documentTypes.map(docType => (
                      <TableHead key={docType.id} className="text-center">
                        <div className="space-y-1">
                          <div className="font-medium">{docType.name}</div>
                          <div className="text-xs text-gray-500">
                            {docType.required ? 'Bắt buộc' : 'Tùy chọn'}
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.student_id}</div>
                        </div>
                      </TableCell>
                      {documentTypes.map(docType => {
                        const submission = documentSubmissions.find(
                          d => d.student_id === student.id && d.document_type === docType.name
                        );
                        return (
                          <TableCell key={docType.id} className="text-center">
                            <div className="space-y-1">
                              {getDocumentStatusBadge(submission?.submission_status || 'not_submitted')}
                              {submission?.submitted_at && (
                                <div className="text-xs text-gray-500">
                                  {new Date(submission.submitted_at).toLocaleDateString('vi-VN')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Registration Detail Modal */}
      <Dialog open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký sự kiện</DialogTitle>
            <DialogDescription>
              Thông tin đăng ký sự kiện của sinh viên
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Thông tin sinh viên</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Tên:</span> {selectedRegistration.student.name}</p>
                    <p><span className="font-medium">MSSV:</span> {selectedRegistration.student.student_id}</p>
                    <p><span className="font-medium">Email:</span> {selectedRegistration.student.email}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedRegistration.student.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Thông tin sự kiện</h4>
                  <div className="mt-2 space-y-1">
                    <p><span className="font-medium">Tên sự kiện:</span> {selectedRegistration.event.title}</p>
                    <p><span className="font-medium">Ngày:</span> {selectedRegistration.event.date}</p>
                    <p><span className="font-medium">Địa điểm:</span> {selectedRegistration.event.location}</p>
                    <p><span className="font-medium">Loại:</span> {selectedRegistration.event.type}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chi tiết đăng ký</h4>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Trạng thái:</span> {getEventStatusBadge(selectedRegistration.participation.participation_status)}</p>
                  <p><span className="font-medium">Thời gian đăng ký:</span> {selectedRegistration.participation.registered_at ? new Date(selectedRegistration.participation.registered_at).toLocaleString('vi-VN') : 'N/A'}</p>
                  <p><span className="font-medium">Thông tin liên hệ:</span> {selectedRegistration.participation.contact_info || 'N/A'}</p>
                  {selectedRegistration.participation.registration_note && (
                    <p><span className="font-medium">Ghi chú:</span> {selectedRegistration.participation.registration_note}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

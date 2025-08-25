import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  MessageCircle,
  Sparkles,
  Star,
  Heart,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  Send,
  Github,
  Linkedin,
  Facebook
} from "lucide-react";

export default function Contact() {
  const contactInfo = {
    name: "Nhật Nguyễn Hoàng Minh",
    title: "Founder & Team Leader - Unicorn Team",
    bio: "Chào mừng đến với Unicorn Team! Tôi là người sáng lập và dẫn dắt đội ngũ 20 sinh viên tài năng. Với tâm huyết giáo dục và công nghệ, tôi luôn tin rằng mỗi sinh viên đều có tiềm năng trở thành 'kỳ lân' trong lĩnh vực của mình.",
    email: "nhat.nguyen@unicornteam.vn",
    phone: "+84 123 456 789",
    address: "Hồ Chí Minh, Việt Nam",
    website: "www.unicornteam.vn",
    avatar: "/placeholder.svg"
  };

  const achievements = [
    { icon: Users, title: "20+ Sinh viên", description: "Đã hướng dẫn và phát triển" },
    { icon: Trophy, title: "50+ Dự án", description: "Hoàn thành thành công" },
    { icon: BookOpen, title: "100+ Workshop", description: "Tổ chức và thực hiện" },
    { icon: Star, title: "95%", description: "Tỷ lệ sinh viên hài lòng" }
  ];

  const specialties = [
    "Quản lý và phát triển nhân tài",
    "Giáo dục công nghệ thông tin",
    "Tổ chức sự kiện và workshop",
    "Mentoring và career coaching",
    "Xây dựng cộng đồng học tập",
    "Phát triển kỹ năng mềm"
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", link: "#", color: "text-blue-600" },
    { icon: Linkedin, label: "LinkedIn", link: "#", color: "text-blue-700" },
    { icon: Github, label: "GitHub", link: "#", color: "text-gray-800" },
    { icon: Globe, label: "Website", link: "#", color: "text-unicorn-pink" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-unicorn-pink/20 shadow-lg">
                <AvatarImage src={contactInfo.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white text-4xl">
                  NM
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4">
            {contactInfo.name}
          </h1>
          <p className="text-xl text-unicorn-pink font-medium mb-4">
            {contactInfo.title}
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {contactInfo.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageCircle className="w-5 h-5 text-unicorn-pink" />
                  Thông tin liên hệ
                </CardTitle>
                <CardDescription>
                  Hãy liên hệ với tôi qua các kênh sau để được tư vấn và hỗ trợ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-unicorn-pink/5 hover:bg-unicorn-pink/10 transition-colors">
                  <div className="w-12 h-12 bg-unicorn-pink/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-unicorn-pink" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">{contactInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-unicorn-purple/5 hover:bg-unicorn-purple/10 transition-colors">
                  <div className="w-12 h-12 bg-unicorn-purple/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-unicorn-purple" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Số điện thoại</p>
                    <p className="text-muted-foreground">{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-unicorn-pink/5 hover:bg-unicorn-pink/10 transition-colors">
                  <div className="w-12 h-12 bg-unicorn-pink/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-unicorn-pink" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Địa chỉ</p>
                    <p className="text-muted-foreground">{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-unicorn-purple/5 hover:bg-unicorn-purple/10 transition-colors">
                  <div className="w-12 h-12 bg-unicorn-purple/20 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-unicorn-purple" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Website</p>
                    <p className="text-muted-foreground">{contactInfo.website}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Star className="w-5 h-5 text-unicorn-pink" />
                  Chuyên môn & Dịch vụ
                </CardTitle>
                <CardDescription>
                  Những lĩnh vực tôi có thể hỗ trợ và tư vấn cho bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5">
                      <Heart className="w-4 h-4 text-unicorn-pink flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{specialty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="border-unicorn-pink/20 bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Sẵn sàng bắt đầu hành trình cùng Unicorn Team?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Hãy liên hệ với tôi ngay hôm nay để được tư vấn về việc tham gia team hoặc các dịch vụ giáo dục.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-unicorn-pink hover:bg-unicorn-pink-dark text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Gửi email ngay
                  </Button>
                  <Button variant="outline" className="border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple/10">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi điện thoại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trophy className="w-5 h-5 text-unicorn-pink" />
                  Thành tựu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-unicorn-pink/5 to-unicorn-purple/5">
                      <div className="w-12 h-12 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-unicorn-pink">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Globe className="w-5 h-5 text-unicorn-pink" />
                  Mạng xã hội
                </CardTitle>
                <CardDescription>
                  Kết nối với tôi trên các nền tảng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start gap-3 hover:bg-unicorn-pink/10"
                      asChild
                    >
                      <a href={social.link} target="_blank" rel="noopener noreferrer">
                        <Icon className={`w-5 h-5 ${social.color}`} />
                        {social.label}
                      </a>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-unicorn-pink" />
                  Liên hệ nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" className="w-full border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple/10">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat trực tuyến
                </Button>
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Thời gian phản hồi: <strong>24 giờ</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Target, Star } from "lucide-react";

// Simple Military page without complex animations
const MilitarySimple = () => {
  const [activeTab, setActiveTab] = useState("intro");

  const stats = [
    { number: "4", label: "Tuần Huấn Luyện", icon: Shield },
    { number: "98%", label: "Tỷ Lệ Đỗ", icon: Award },
    { number: "15", label: "Môn Học Quân Sự", icon: Target },
    { number: "1000+", label: "Sinh Viên Tham Gia", icon: Star },
  ];

  const tabs = [
    { id: "intro", label: "Giới Thiệu" },
    { id: "schedule", label: "Lịch Trình" },
    { id: "supplies", label: "Vật Dụng" },
    { id: "training", label: "Huấn Luyện" },
    { id: "evaluation", label: "Đánh Giá" },
    { id: "benefits", label: "Lợi Ích" },
    { id: "gallery", label: "Hình Ảnh" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Chương Trình Giáo Dục Quốc Phòng
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Trải nghiệm huấn luyện quân sự chuyên nghiệp, rèn luyện ý chí và kỷ luật cho sinh viên FPT
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/10 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === "intro" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Giới Thiệu Chương Trình</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chương trình Giáo dục Quốc phòng tại FPT University là một phần quan trọng trong quá trình đào tạo,
                giúp sinh viên phát triển toàn diện về thể chất, tinh thần và kỹ năng sống.
              </p>
            </div>
          )}

          {activeTab === "schedule" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Lịch Trình Huấn Luyện</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Tuần 1: Làm quen và cơ bản</h3>
                  <p className="text-gray-600">Học các quy định, kỷ luật quân đội cơ bản</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Tuần 2-3: Huấn luyện chuyên sâu</h3>
                  <p className="text-gray-600">Thể dục thể thao, đội ngũ, bài ca quân đội</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold">Tuần 4: Tổng kết và đánh giá</h3>
                  <p className="text-gray-600">Kiểm tra cuối kỳ, tổng kết thành tích</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "supplies" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Vật Dụng Cần Thiết</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Đồ dùng cá nhân (bắt buộc)</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Dép tổ ong / dép lào</li>
                    <li>• Tất màu đen/xanh rêu (5-7 đôi)</li>
                    <li>• Đồ lót thoáng mát</li>
                    <li>• Khăn tắm, khăn mặt</li>
                    <li>• Bình nước cá nhân</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Đồ vệ sinh</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Xà phòng, sữa tắm, dầu gội</li>
                    <li>• Bàn chải + kem đánh răng</li>
                    <li>• Giấy vệ sinh, khăn giấy</li>
                    <li>• Nước rửa tay khô</li>
                    <li>• Thuốc chống muỗi</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Add other tab contents as needed */}
          {activeTab !== "intro" && activeTab !== "schedule" && activeTab !== "supplies" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Nội dung đang được cập nhật</h2>
              <p className="text-gray-600">Vui lòng quay lại sau để xem thêm thông tin chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilitarySimple;

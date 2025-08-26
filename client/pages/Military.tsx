import React, { useState, useEffect } from "react";

// Safe fallback for framer-motion to avoid bundle initialization errors in production
// This proxy returns regular HTML elements so existing <motion.*> usage won't break.
const AnimatePresence: any = ({ children }: any) => <>{children}</>;

const motion: any = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return (props: any) => {
        const Tag = prop as keyof JSX.IntrinsicElements;
        return React.createElement(Tag as any, props, props?.children);
      };
    },
  }
);
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Award, Target, Star, Clock, MapPin, Users, BookOpen, Download, Play, Flag, Trophy, FileText, Eye, EyeOff, X, Edit, Trash2, Plus } from "lucide-react";

const Military = () => {
  const [activeTab, setActiveTab] = useState("intro");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: Array<{name: string, quantity: number, price: number}>}>({});
  
  // Admin Mode States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Admin password (in production, this should be environment variable)
  const ADMIN_PASSWORD = "Minhnhat123@";
  
  const [defaultItems, setDefaultItems] = useState<{[key: string]: Array<{name: string, quantity: number, price: number}>}>({
    "Đồ dùng cá nhân (bắt buộc)": [
      { name: "Dép tổ ong / dép lào (đi lại trong khu)", quantity: 1, price: 50000 },
      { name: "Tất (màu đen/xanh rêu) 5–7 đôi", quantity: 6, price: 15000 },
      { name: "Đồ lót (thoáng mát, dễ giặt, khô nhanh)", quantity: 5, price: 25000 },
      { name: "Khăn tắm, khăn mặt (2–3 cái)", quantity: 3, price: 30000 },
      { name: "Bình nước cá nhân (loại giữ nhiệt càng tốt)", quantity: 1, price: 120000 }
    ],
    "Đồ vệ sinh – chăm sóc bản thân": [
      { name: "Xà phòng, sữa tắm, dầu gội (gói nhỏ)", quantity: 3, price: 25000 },
      { name: "Bàn chải + kem đánh răng", quantity: 1, price: 35000 },
      { name: "Giấy vệ sinh, khăn giấy, khăn ướt", quantity: 5, price: 20000 },
      { name: "Nước rửa tay khô", quantity: 2, price: 25000 },
      { name: "Thuốc chống muỗi/kem chống muỗi", quantity: 2, price: 40000 }
    ],
    "Đồ giặt – phơi": [
      { name: "Bột giặt/nước giặt gói nhỏ", quantity: 3, price: 15000 },
      { name: "Bàn chải giặt quần áo", quantity: 1, price: 20000 },
      { name: "Kẹp phơi đồ, móc áo (tầm 10–15 cái)", quantity: 12, price: 5000 },
      { name: "Dây phơi (loại dù bền, có móc)", quantity: 1, price: 30000 }
    ],
    "Dụng cụ sinh hoạt": [
      { name: "Chậu nhựa nhỏ (giặt đồ, rửa mặt)", quantity: 1, price: 45000 },
      { name: "Đèn pin nhỏ (ưu tiên loại sạc USB)", quantity: 1, price: 80000 },
      { name: "Ổ cắm kéo dài (nếu đơn vị cho dùng điện)", quantity: 1, price: 60000 },
      { name: "Gối nhỏ / gối hơi", quantity: 1, price: 50000 },
      { name: "Quạt mini USB (rất cần nếu trời nóng)", quantity: 1, price: 150000 }
    ],
    "Thuốc & y tế cá nhân": [
      { name: "Băng gạc, urgo", quantity: 1, price: 30000 },
      { name: "Thuốc đau đầu, cảm cúm, tiêu hoá", quantity: 3, price: 20000 },
      { name: "Thuốc chống côn trùng (muỗi, kiến)", quantity: 2, price: 35000 },
      { name: "Vitamin C tăng đề kháng", quantity: 1, price: 45000 }
    ],
    "Đồ học tập": [
      { name: "Sổ tay nhỏ", quantity: 2, price: 15000 },
      { name: "Bút bi, bút chì, thước kẻ", quantity: 1, price: 25000 }
    ]
  });
  const [countdown, setCountdown] = useState({
    days: 120,
    hours: 14,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddItem = (category: string) => {
    setSelectedCategory(category);
    setShowAddItemModal(true);
  };

  const addItemToCart = (name: string, quantity: number, price: number) => {
    setCartItems(prev => ({
      ...prev,
      [selectedCategory]: [
        ...(prev[selectedCategory] || []),
        { name, quantity, price }
      ]
    }));
    setShowAddItemModal(false);
  };

  const removeItemFromCart = (category: string, index: number) => {
    setCartItems(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const updateItemQuantity = (category: string, itemName: string, newQuantity: number) => {
    setDefaultItems(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.name === itemName ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    }));
  };

  const updateItemPrice = (category: string, itemName: string, newPrice: number) => {
    setDefaultItems(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.name === itemName ? { ...item, price: Math.max(0, newPrice) } : item
      )
    }));
  };

  const getCategoryTotal = (category: string) => {
    return defaultItems[category]?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;
  };

  const getTotalPrice = () => {
    return Object.values(defaultItems).flat().reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Admin Mode Functions
  
    const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Mật khẩu không đúng!");
      setPasswordInput("");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError("");
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      // If already in admin mode, toggle off
      setIsAdminMode(false);
    } else {
      // If not in admin mode, show password modal
      setShowPasswordModal(true);
    }
  };

  const trainings = [
    { name: "Kiến thức chính trị - quốc phòng - an ninh", hours: 120, icon: Shield },
    { name: "Kiến thức quân sự cơ bản", hours: 48, icon: Target },
    { name: "Kỹ thuật quân sự", hours: 120, icon: Award },
    { name: "Chiến thuật bộ binh", hours: 120, icon: BookOpen },
    { name: "Thực hành rèn luyện", hours: 120, icon: Trophy }
  ];

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const fadeInLeft: any = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const fadeInRight: any = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const scaleIn: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  const slideInUp: any = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const staggerChildren: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const staggerChildrenFast: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const bounceIn: any = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      rotate: -10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 300,
        duration: 0.8
      } 
    }
  };

  const floatingAnimation: any = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Unicorn_NhapNgu.png')`,
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-green-900/40"></div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div
            className="relative mb-8"
            variants={bounceIn}
          >
            <motion.div 
              className="mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl"
              {...floatingAnimation}
            >
              <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-16 h-16 text-white relative z-10" />
              </motion.div>
            </motion.div>
            <motion.div
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-lg font-bold shadow-lg">
                🎖️ KHÓA QUÂN SỰ 2025
              </Badge>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 mb-6"
            variants={fadeInUp}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            GIÁO DỤC QUÂN SỰ
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Rèn luyện ý chí, kỷ luật và tinh thần yêu nước qua chương trình giáo dục quân sự toàn diện
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
            variants={staggerChildren}
          >
            {[
              { label: "NGÀY", value: countdown.days, color: "from-red-500 to-red-600" },
              { label: "GIỜ", value: countdown.hours, color: "from-orange-500 to-orange-600" },
              { label: "PHÚT", value: countdown.minutes, color: "from-yellow-500 to-yellow-600" },
              { label: "GIÂY", value: countdown.seconds, color: "from-green-500 to-green-600" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${item.color} p-4 rounded-xl shadow-2xl`}
                variants={scaleIn}
              >
                <div className="text-3xl font-bold text-white">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-white/80 font-semibold">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              TẢI TÀI LIỆU
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              XEM VIDEO
            </Button>
          </motion.div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {[
            { title: "165 Tiết", subtitle: "Tổng thời gian", icon: Clock, color: "from-blue-500 to-blue-600" },
            { title: "3 - 4 tuần", subtitle: "Thời gian thực hiện", icon: MapPin, color: "from-purple-500 to-purple-600" },
            { title: "1000+", subtitle: "Sinh viên tham gia", icon: Users, color: "from-green-500 to-green-600" },
            { title: "98%", subtitle: "Tỷ lệ đỗ", icon: Trophy, color: "from-orange-500 to-orange-600" }
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              variants={slideInUp}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="bg-gradient-to-br from-black/30 to-black/50 border border-gray-500/30 backdrop-blur-lg transition-all duration-300 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/20">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    className={`mx-auto w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
                    animate={{ 
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.title}
                  </motion.h3>
                  <motion.p 
                    className="text-green-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {stat.subtitle}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Information Tabs */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h2
            className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-8"
            variants={fadeInUp}
          >
            THÔNG TIN CHI TIẾT
          </motion.h2>

          {/* Tab Navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-8"
            variants={staggerChildren}
          >
            {[
              { id: "intro", label: "Giới thiệu", icon: BookOpen },
              { id: "courses", label: "Khóa học", icon: Target },
              { id: "rules", label: "Quy định", icon: Shield },
              { id: "schedule", label: "Lịch trình", icon: Clock },
              { id: "gallery", label: "Hình ảnh", icon: Star },
              { id: "faq", label: "FAQ", icon: Award },
              { id: "contact", label: "Liên hệ", icon: Users },
              { id: "supplies", label: "Dự kiến vật phẩm", icon: Trophy },
              { id: "documents", label: "Tài liệu", icon: FileText }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-green-300 hover:bg-slate-700/50'
                }`}
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div
                  animate={activeTab === tab.id ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <tab.icon className="w-4 h-4" />
                </motion.div>
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <Card className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-slate-700/50 backdrop-blur-lg">
              <CardContent className="p-8">
                {activeTab === "intro" && (
                  <motion.div 
                    className="space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <motion.h3 
                        className="text-3xl font-bold text-yellow-400"
                        variants={fadeInUp}
                      >
                        Ý nghĩa học kỳ quân sự
                      </motion.h3>
                      {isAdminMode && (
                        <button className="ml-4 px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                          <Edit className="w-4 h-4 inline mr-1" />
                          Chỉnh sửa
                        </button>
                      )}
                    </div>
                    
                    {/* Ý nghĩa chính */}
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                      variants={staggerChildren}
                    >
                      {[
                        {
                          icon: Flag,
                          title: "Tinh thần yêu nước",
                          description: "Giáo dục truyền thống, lịch sử và văn hóa dân tộc, gây dựng lòng tự hào và trách nhiệm với Tổ quốc."
                        },
                        {
                          icon: Trophy,
                          title: "Rèn luyện thể lực",
                          description: "Tăng cường sức khỏe và thể lực cho sinh viên thông qua các bài tập quân sự và thể dục."
                        },
                        {
                          icon: Users,
                          title: "Kỷ luật tập thể",
                          description: "Học cách làm việc nhóm và tuân thủ kỷ luật, phát triển tinh thần đoàn kết và trách nhiệm."
                        }
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg"
                          variants={slideInUp}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="flex items-center mb-4"
                            variants={fadeInLeft}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <item.icon className="w-8 h-8 text-yellow-400 mr-3" />
                            </motion.div>
                            <h4 className="text-xl font-bold text-yellow-400">{item.title}</h4>
                          </motion.div>
                          <motion.p 
                            className="text-yellow-100 text-sm leading-relaxed"
                            variants={fadeInUp}
                          >
                            {item.description}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Thông điệp từ nhà trường */}
                    <motion.div 
                      className="bg-gradient-to-r from-black/30 via-black/40 to-black/30 border-2 border-yellow-400/40 p-8 rounded-xl"
                      variants={bounceIn}
                      whileHover={{ scale: 1.02, rotateX: 2 }}
                    >
                      <motion.div 
                        className="text-center mb-6"
                        variants={fadeInUp}
                      >
                        <motion.div 
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4"
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <BookOpen className="w-8 h-8 text-green-800" />
                        </motion.div>
                        <h4 className="text-2xl font-bold text-yellow-400">Thông điệp từ nhà trường</h4>
                      </motion.div>
                      
                      <motion.blockquote 
                        className="text-center"
                        variants={fadeInUp}
                      >
                        <motion.p 
                          className="text-lg text-yellow-100 leading-relaxed italic mb-4"
                          variants={fadeInUp}
                        >
                          "Học kỳ quân sự không chỉ là việc rèn luyện thể chất mà còn là cơ hội để các bạn sinh viên 
                          trưởng thành về mặt tinh thần, học cách tự lập và có trách nhiệm với bản thân, gia đình và xã hội."
                        </motion.p>
                        <motion.footer 
                          className="text-yellow-300 font-semibold"
                          variants={fadeInUp}
                        >
                          - Ban Giám hiệu Đại học FPT
                        </motion.footer>
                      </motion.blockquote>
                    </motion.div>

                    {/* Thống kê và kết quả */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      variants={staggerChildren}
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg"
                        variants={fadeInLeft}
                        whileHover={{ 
                          scale: 1.03,
                          rotateY: 5,
                          boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.4)"
                        }}
                      >
                        <motion.h4 
                          className="text-yellow-400 font-semibold mb-4 text-lg"
                          variants={fadeInUp}
                        >
                          Mục tiêu đào tạo
                        </motion.h4>
                        <motion.ul 
                          className="text-yellow-100 space-y-2"
                          variants={staggerChildrenFast}
                        >
                          {[
                            "Rèn luyện ý chí, kỷ luật và tính tự giác",
                            "Nâng cao thể lực và sức khỏe toàn diện",
                            "Học tập kiến thức quân sự cơ bản",
                            "Phát triển tinh thần yêu nước, yêu dân"
                          ].map((item, index) => (
                            <motion.li 
                              key={index}
                              className="flex items-center"
                              variants={slideInUp}
                              whileHover={{ x: 10 }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                              >
                                <Star className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                              </motion.div>
                              {item}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg"
                        variants={fadeInRight}
                        whileHover={{ 
                          scale: 1.03,
                          rotateY: -5,
                          boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.4)"
                        }}
                      >
                        <motion.h4 
                          className="text-yellow-400 font-semibold mb-4 text-lg"
                          variants={fadeInUp}
                        >
                          Kết quả đạt được
                        </motion.h4>
                        <motion.div 
                          className="space-y-3"
                          variants={staggerChildrenFast}
                        >
                          {[
                            { label: "Tỷ lệ đỗ:", value: "98%" },
                            { label: "Điểm trung bình:", value: "8.5/10" },
                            { label: "Đánh giá xuất sắc:", value: "85%" },
                            { label: "Tham gia hoạt động:", value: "100%" }
                          ].map((stat, index) => (
                            <motion.div 
                              key={index}
                              className="flex justify-between items-center"
                              variants={slideInUp}
                              whileHover={{ scale: 1.05, x: 5 }}
                            >
                              <span className="text-yellow-100">{stat.label}</span>
                              <motion.span 
                                className="text-yellow-400 font-bold text-lg"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  color: ["#fbbf24", "#f59e0b", "#fbbf24"]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                              >
                                {stat.value}
                              </motion.span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "courses" && (
                  <motion.div 
                    className="space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                  >
                    <motion.h3 
                      className="text-3xl font-bold text-yellow-400 mb-6 text-center"
                      variants={fadeInUp}
                    >
                      Thông tin khóa học
                    </motion.h3>
                    
                    {/* Thông tin khóa học */}
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
                      variants={staggerChildren}
                    >
                      {[
                        { icon: Clock, title: "Thời gian", content: "3 - 4 tuần" },
                        { icon: MapPin, title: "Địa điểm", content: "Trường Quân sự Quân khu 7" },
                        { icon: Award, title: "Chứng chỉ", content: "Hoàn thành khóa học" }
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg text-center"
                          variants={bounceIn}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 10,
                            boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.4)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="flex items-center justify-center mb-4"
                            animate={{ 
                              rotateY: [0, 360],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                          >
                            <item.icon className="w-8 h-8 text-yellow-400" />
                          </motion.div>
                          <motion.h4 
                            className="text-xl font-bold text-yellow-400 mb-2"
                            variants={fadeInUp}
                          >
                            {item.title}
                          </motion.h4>
                          <motion.p 
                            className="text-yellow-100 text-lg font-semibold"
                            variants={fadeInUp}
                          >
                            {item.content}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Các môn học chính */}
                    <motion.div variants={fadeInUp}>
                      <motion.h4 
                        className="text-2xl font-bold text-yellow-400 mb-6 text-center"
                        variants={fadeInUp}
                      >
                        Các môn học chính
                      </motion.h4>
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerChildren}
                      >
                        {[
                          { icon: Shield, title: "Quân sự cơ bản", desc: "Kiến thức nền tảng về quân sự, tổ chức bộ đội và nhiệm vụ quốc phòng", hours: "40 tiết" },
                          { icon: Target, title: "Chiến thuật", desc: "Học tập các nguyên tắc chiến thuật cơ bản và kỹ năng tác chiến", hours: "30 tiết" },
                          { icon: Trophy, title: "Thể lực chiến đấu", desc: "Rèn luyện thể lực, sức bền và kỹ năng vận động quân sự", hours: "50 tiết" },
                          { icon: BookOpen, title: "Y học quân sự", desc: "Sơ cứu, y học cơ bản và chăm sóc sức khỏe trong điều kiện quân sự", hours: "25 tiết" },
                          { icon: Star, title: "Kỹ thuật chiến đấu", desc: "Thực hành các kỹ năng chiến đấu cơ bản và sử dụng trang thiết bị", hours: "35 tiết" },
                          { icon: Users, title: "Giáo dục chính trị", desc: "Giáo dục lý tưởng cách mạng, đạo đức và lối sống quân đội", hours: "20 tiết" }
                        ].map((subject, index) => (
                          <motion.div 
                            key={index}
                            className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg"
                            variants={slideInUp}
                            whileHover={{ 
                              scale: 1.05,
                              rotateX: 5,
                              boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.4)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <motion.div 
                              className="flex items-center mb-4"
                              variants={fadeInLeft}
                            >
                              <motion.div
                                animate={{ 
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                              >
                                <subject.icon className="w-8 h-8 text-yellow-400 mr-3" />
                              </motion.div>
                              <h5 className="text-lg font-bold text-yellow-400">{subject.title}</h5>
                            </motion.div>
                            <motion.p 
                              className="text-yellow-100 text-sm mb-2"
                              variants={fadeInUp}
                            >
                              {subject.desc}
                            </motion.p>
                            <motion.div 
                              className="text-yellow-300 font-semibold"
                              variants={fadeInUp}
                              animate={{ 
                                scale: [1, 1.05, 1],
                                color: ["#fcd34d", "#f59e0b", "#fcd34d"]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            >
                              {subject.hours}
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "rules" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center mb-6">
                      <h3 className="text-3xl font-bold text-yellow-400">Quy định & Chuẩn bị</h3>
                      {isAdminMode && (
                        <div className="ml-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all duration-200">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Thêm quy định
                          </button>
                          <button className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                            <Edit className="w-4 h-4 inline mr-1" />
                            Chỉnh sửa
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Trang phục quy định */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6">Trang phục quy định</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trong trại */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Shield className="w-6 h-6 text-yellow-400 mr-3" />
                            <h5 className="text-xl font-bold text-yellow-400">Trong trại</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-2">
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Quân phục huấn luyện (do trại cấp)
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Giày chiến đấu đen
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Nón lưỡi trai
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Dây nịt quân đội
                            </li>
                          </ul>
                        </div>

                        {/* Ngoài giờ */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                            <h5 className="text-xl font-bold text-yellow-400">Ngoài giờ</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-2">
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Áo thun trắng, đen hoặc xanh
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Quần jean hoặc kaki
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Giày thể thao
                            </li>
                            <li className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              Không mặc quần short
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Vật dụng cần mang */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6">Vật dụng cần mang</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Đồ dùng cá nhân */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Users className="w-6 h-6 text-yellow-400 mr-3" />
                            <h5 className="text-lg font-bold text-yellow-400">Đồ dùng cá nhân</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-1 text-sm">
                            <li>• Bàn chải đánh răng</li>
                            <li>• Kem đánh răng</li>
                            <li>• Xà phòng</li>
                            <li>• Dầu gội</li>
                            <li>• Khăn tắm</li>
                            <li>• Khăn mặt</li>
                          </ul>
                        </div>

                        {/* Quần áo */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Star className="w-6 h-6 text-yellow-400 mr-3" />
                            <h5 className="text-lg font-bold text-yellow-400">Quần áo</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-1 text-sm">
                            <li>• Áo thun (5-7 cái)</li>
                            <li>• Quần lót (7-10 cái)</li>
                            <li>• Tất (10 đôi)</li>
                            <li>• Quần jean (2-3 cái)</li>
                            <li>• Áo khoác</li>
                          </ul>
                        </div>

                        {/* Học tập */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <BookOpen className="w-6 h-6 text-yellow-400 mr-3" />
                            <h5 className="text-lg font-bold text-yellow-400">Học tập</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-1 text-sm">
                            <li>• Vở ghi chú</li>
                            <li>• Bút bi</li>
                            <li>• Bút chì</li>
                            <li>• Tẩy</li>
                            <li>• Thước kẻ</li>
                            <li>• Túi đựng sách</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Quy tắc kỷ luật */}
                    <div>
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6">Quy tắc kỷ luật</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Được phép */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Trophy className="w-6 h-6 text-green-400 mr-3" />
                            <h5 className="text-xl font-bold text-green-400">Được phép</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-2">
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2 text-lg">✓</span>
                              Thức dậy đúng giờ quy định
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2 text-lg">✓</span>
                              Tham gia đầy đủ các hoạt động
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2 text-lg">✓</span>
                              Giữ gìn vệ sinh cá nhân và chung
                            </li>
                            <li className="flex items-start">
                              <span className="text-green-400 mr-2 text-lg">✓</span>
                              Tôn trọng cấp trên và đồng đội
                            </li>
                          </ul>
                        </div>

                        {/* Không được phép */}
                        <div className="bg-gradient-to-br from-black/40 to-black/60 border border-gray-500/30 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <Target className="w-6 h-6 text-red-400 mr-3" />
                            <h5 className="text-xl font-bold text-red-400">Không được phép</h5>
                          </div>
                          <ul className="text-yellow-100 space-y-2">
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2 text-lg">✗</span>
                              Không được rời trại khi chưa có phép
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2 text-lg">✗</span>
                              Không sử dụng điện thoại trong giờ học
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2 text-lg">✗</span>
                              Không mang đồ uống có cồn
                            </li>
                            <li className="flex items-start">
                              <span className="text-red-400 mr-2 text-lg">✗</span>
                              Không hút thuốc trong khu vực trại
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center mb-6">
                      <h3 className="text-3xl font-bold text-yellow-400">Lịch trình hàng ngày</h3>
                      {isAdminMode && (
                        <div className="ml-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all duration-200">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Thêm
                          </button>
                          <button className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                            <Edit className="w-4 h-4 inline mr-1" />
                            Chỉnh sửa
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 rounded-xl overflow-hidden shadow-2xl">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 border-b border-slate-600/50">
                        <h4 className="text-xl font-bold text-yellow-300 text-center flex items-center justify-center">
                          <Clock className="w-6 h-6 mr-2" />
                          Thời gian biểu trong trại
                        </h4>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-3">
                          {[
                            { time: "05:30", activity: "Thức dậy, vệ sinh cá nhân", icon: "🌅", period: "Sáng sớm" },
                            { time: "06:00", activity: "Tập thể dục buổi sáng", icon: "🏃‍♂️", period: "Sáng sớm" },
                            { time: "07:00", activity: "Ăn sáng", icon: "🍽️", period: "Sáng" },
                            { time: "08:00", activity: "Học lý thuyết", icon: "📚", period: "Sáng" },
                            { time: "10:00", activity: "Giải lao", icon: "☕", period: "Sáng" },
                            { time: "10:15", activity: "Tiếp tục học tập", icon: "✏️", period: "Sáng" },
                            { time: "12:00", activity: "Ăn trưa & nghỉ ngơi", icon: "🍱", period: "Trưa" },
                            { time: "14:00", activity: "Huấn luyện thực hành", icon: "⚔️", period: "Chiều" },
                            { time: "16:00", activity: "Hoạt động thể thao", icon: "⚽", period: "Chiều" },
                            { time: "18:00", activity: "Ăn tối", icon: "🍽️", period: "Tối" },
                            { time: "19:00", activity: "Sinh hoạt tập thể", icon: "👥", period: "Tối" },
                            { time: "21:00", activity: "Vệ sinh cá nhân", icon: "🚿", period: "Tối" },
                            { time: "22:00", activity: "Tắt đèn nghỉ ngơi", icon: "🌙", period: "Đêm" }
                          ].map((item, index) => (
                            <div 
                              key={index} 
                              className="flex items-center p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-lg border border-slate-600/30 hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-300 group"
                            >
                              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg text-yellow-200 font-bold text-sm mr-4 flex-shrink-0 group-hover:from-slate-500 group-hover:to-slate-600 transition-all duration-300">
                                <div className="text-center">
                                  <div className="text-lg font-black text-white">{item.time.split(':')[0]}</div>
                                  <div className="text-sm font-bold text-yellow-100">:{item.time.split(':')[1]}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center flex-1">
                                <span className="text-xl mr-4 opacity-80">{item.icon}</span>
                                <div className="flex-1">
                                  <h5 className="text-base font-semibold text-yellow-200 mb-1">{item.activity}</h5>
                                  <div className="flex items-center">
                                    <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">{item.period}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right text-xs text-slate-400 ml-4">
                                {index === 0 ? "Bắt đầu ngày" : 
                                 index === 12 ? "Kết thúc ngày" : 
                                 `${Math.floor(Math.random() * 60 + 30)}p`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ghi chú quan trọng */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-5 h-5 text-blue-400" />
                          </div>
                          <h4 className="text-lg font-bold text-yellow-300">Lưu ý quan trọng</h4>
                        </div>
                        <ul className="text-slate-300 space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">▪</span>
                            Tuyệt đối tuân thủ đúng giờ quy định
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">▪</span>
                            Không được vắng mặt khi chưa có phép
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">▪</span>
                            Báo cáo ngay khi có vấn đề sức khỏe
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">▪</span>
                            Giữ trật tự trong mọi hoạt động
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mr-3">
                            <Trophy className="w-5 h-5 text-green-400" />
                          </div>
                          <h4 className="text-lg font-bold text-yellow-300">Mục tiêu hàng ngày</h4>
                        </div>
                        <ul className="text-slate-300 space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">▪</span>
                            Hoàn thành 100% các bài tập được giao
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">▪</span>
                            Rèn luyện kỷ luật và tinh thần tập thể
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">▪</span>
                            Nâng cao thể lực và sức khỏe
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">▪</span>
                            Học hỏi kiến thức quân sự cơ bản
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center mb-6">
                      <h3 className="text-3xl font-bold text-yellow-400">Hình ảnh hoạt động</h3>
                      {isAdminMode && (
                        <div className="ml-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all duration-200">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Thêm ảnh
                          </button>
                          <button className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                            <Edit className="w-4 h-4 inline mr-1" />
                            Quản lý
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Hero Image Section */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40">
                      <div className="aspect-video relative">
                        <img 
                          src="/Unicorn_NhapNgu.png" 
                          alt="Lễ khai giảng khóa quân sự 2025"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute bottom-6 left-6 z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3">
                            <Star className="w-8 h-8 text-slate-900" />
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-2">Lễ khai giảng khóa quân sự 2025</h4>
                          <p className="text-slate-300">Hình ảnh chính thức từ buổi lễ khai giảng</p>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Grid - Masonry Style */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Column 1 */}
                      <div className="space-y-4">
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-square relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Huấn luyện cơ bản"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-red-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-2">
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Huấn luyện</p>
                              <p className="text-slate-300 text-xs">Cơ bản</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-[4/5] relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Thể dục buổi sáng"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                                <Target className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Thể dục</p>
                              <p className="text-slate-300 text-xs">Buổi sáng</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-4">
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-[4/5] relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Diễu hành đội ngũ"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-green-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-2">
                                <Trophy className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Diễu hành</p>
                              <p className="text-slate-300 text-xs">Đội ngũ</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-square relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Sinh hoạt tập thể"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-purple-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Sinh hoạt</p>
                              <p className="text-slate-300 text-xs">Tập thể</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-4">
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-square relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Học tập lý thuyết"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-yellow-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-2">
                                <BookOpen className="w-5 h-5 text-slate-900" />
                              </div>
                              <p className="text-white text-sm font-semibold">Học tập</p>
                              <p className="text-slate-300 text-xs">Lý thuyết</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-[4/5] relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Thi đấu thể thao"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-indigo-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-2">
                                <Award className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Thi đấu</p>
                              <p className="text-slate-300 text-xs">Thể thao</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 4 */}
                      <div className="space-y-4">
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-[4/5] relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Lễ bế giảng"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-teal-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center mb-2">
                                <Star className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Lễ bế giảng</p>
                              <p className="text-slate-300 text-xs">Tốt nghiệp</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 hover:border-yellow-400/50 transition-all duration-300">
                          <div className="aspect-square relative">
                            <img 
                              src="/Unicorn_NhapNgu.png" 
                              alt="Lễ chào cờ"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-rose-500/20"></div>
                            <div className="absolute bottom-3 left-3 z-10">
                              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center mb-2">
                                <Flag className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white text-sm font-semibold">Lễ chào cờ</p>
                              <p className="text-slate-300 text-xs">Hàng ngày</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-400/30 p-6 rounded-xl text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4">
                        <Star className="w-6 h-6 text-slate-900" />
                      </div>
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">Bộ sưu tập hình ảnh quân sự</h4>
                      <p className="text-slate-300 text-sm">
                        Ghi lại những khoảnh khắc đáng nhớ trong hành trình rèn luyện của các chiến sĩ tương lai
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "faq" && (
                  <motion.div 
                    className="space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <motion.h3 
                        className="text-3xl font-bold text-yellow-400"
                        variants={fadeInUp}
                      >
                        FAQ – Học kỳ quân sự FPT
                      </motion.h3>
                      {isAdminMode && (
                        <div className="ml-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all duration-200">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Thêm câu hỏi
                          </button>
                          <button className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                            <Edit className="w-4 h-4 inline mr-1" />
                            Chỉnh sửa
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Thông tin chung */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        Thông tin chung
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Học kỳ quân sự diễn ra ở đâu?",
                            a: "Sinh viên FPT HCM thường học kỳ quân sự tại Trường Quân sự Quân khu 7 (TP. Thủ Đức). Đây là đơn vị huấn luyện chính quy, có đủ thao trường, bãi tập, giảng đường và ký túc xá được bố trí theo mô hình quân đội."
                          },
                          {
                            q: "Thời gian học kỳ quân sự bao lâu?",
                            a: "Thời gian khóa học khoảng 3–4 tuần (tương đương 1 tháng), với tổng cộng 165 tiết. Trong suốt thời gian này, sinh viên ăn ở và sinh hoạt tập trung tại Trường Quân sự Quân khu 7, tham gia cả học lý thuyết lẫn rèn luyện thực hành ngoài thao trường."
                          },
                          {
                            q: "Sinh viên nào phải tham gia?",
                            a: "Tất cả sinh viên FPT HCM đều bắt buộc tham gia học kỳ quân sự theo quy định của Bộ Giáo dục & Đào tạo. Thông thường, sinh viên năm nhất sau khi hoàn thành giai đoạn học tiếng Anh dự bị sẽ tham gia khóa huấn luyện này. Đây là môn học bắt buộc để tích lũy tín chỉ và là điều kiện cần thiết cho việc xét tốt nghiệp."
                          },
                          {
                            q: "Mục đích của học kỳ quân sự là gì?",
                            a: "Học kỳ quân sự giúp sinh viên rèn luyện kỷ luật, tác phong đúng giờ, tinh thần đồng đội và ý chí vượt khó. Đồng thời, sinh viên sẽ được trang bị kiến thức cơ bản về quốc phòng – an ninh, học điều lệnh đội ngũ, kỹ thuật quân sự (bắn súng, ném lựu đạn tập, bản đồ – địa hình), kỹ năng sinh tồn và thể lực. Đây cũng là cơ hội để mỗi sinh viên trải nghiệm môi trường quân đội, tăng cường trách nhiệm công dân và tình yêu Tổ quốc."
                          }
                        ].map((faq, index) => (
                          <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <span className="text-yellow-200 font-semibold">Q{index + 1}: {faq.q}</span>
                              <div className={`transform transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {expandedFAQ === index && (
                              <div className="p-4 pt-0 border-t border-slate-600/30">
                                <p className="text-slate-300 flex items-start">
                                  <span className="text-yellow-400 mr-2">👉</span>
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Về sinh hoạt & ăn ở */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        Về sinh hoạt & ăn ở
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Ăn uống ở quân sự thế nào?",
                            a: "Sinh viên ăn tại nhà ăn tập trung của Trường Quân sự Quân khu 7. Suất ăn được chuẩn bị theo tiêu chuẩn quân đội, đảm bảo đủ cơm, canh, món mặn, rau và trái cây theo ngày. Thực đơn thay đổi theo tuần để cân đối dinh dưỡng, tuy không đa dạng như ở nhà nhưng đủ no và bảo đảm sức khỏe cho huấn luyện."
                          },
                          {
                            q: "Ký túc xá có máy lạnh không?",
                            a: "Không. Ký túc xá thường là phòng tập thể từ 8–12 sinh viên, được trang bị giường tầng, quạt trần hoặc quạt tường. Phòng ở đơn giản, đúng mô hình quân đội, giúp rèn luyện sinh hoạt tập thể và tính kỷ luật."
                          },
                          {
                            q: "Có được dùng điện thoại không?",
                            a: "Sinh viên được phép mang theo và sử dụng điện thoại, nhưng phải tuân thủ quy định của đơn vị. Cụ thể: không dùng trong giờ học, giờ thao trường, giờ chào cờ hoặc các hoạt động tập thể. Ngoài giờ sinh hoạt chính, sinh viên có thể liên lạc về nhà bình thường."
                          },
                          {
                            q: "Có wifi không?",
                            a: "Thông thường tại Trường Quân sự Quân khu 7 không cung cấp wifi cho sinh viên. Nếu cần liên lạc hoặc học tập, sinh viên nên chủ động đăng ký gói 4G/5G trên điện thoại."
                          },
                          {
                            q: "Có được mang laptop không?",
                            a: "Không khuyến khích mang laptop theo, vì trong suốt khóa quân sự hầu như không sử dụng đến, đồng thời dễ hư hỏng hoặc thất lạc. Sinh viên chỉ nên mang điện thoại và các vật dụng học tập, sinh hoạt cần thiết."
                          },
                          {
                            q: "Phòng tắm, vệ sinh có sạch không?",
                            a: "Khu vệ sinh và phòng tắm được bố trí tập thể, nam nữ tách riêng. Mức độ sạch sẽ tùy thuộc vào ý thức giữ gìn của tập thể từng phòng. Sinh viên nên chuẩn bị đầy đủ đồ dùng cá nhân như xà phòng, sữa tắm, dép đi trong nhà tắm, xô/ chậu để thuận tiện sử dụng."
                          }
                        ].map((faq, index) => (
                          <div key={index + 4} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === (index + 4) ? null : (index + 4))}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <span className="text-yellow-200 font-semibold">Q{index + 5}: {faq.q}</span>
                              <div className={`transform transition-transform duration-300 ${expandedFAQ === (index + 4) ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {expandedFAQ === (index + 4) && (
                              <div className="p-4 pt-0 border-t border-slate-600/30">
                                <p className="text-slate-300 flex items-start">
                                  <span className="text-yellow-400 mr-2">👉</span>
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Về học tập & rèn luyện */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        Về học tập & rèn luyện
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Học kỳ quân sự học những gì?",
                            a: "Sinh viên sẽ được học và rèn luyện các nội dung chính như: điều lệnh đội ngũ (tập hợp, đi đều, chào cờ…), kỹ thuật bắn súng tiểu liên AK (mô phỏng bằng máy hoặc bắn đạn thật tùy chương trình), kỹ năng ném lựu đạn tập, võ thuật tự vệ, rèn luyện thể lực quân sự, kỹ năng sinh tồn – sơ tán – trú ẩn khi có tình huống khẩn cấp. Ngoài ra còn có học phần lý thuyết về đường lối quốc phòng – an ninh và âm mưu thủ đoạn chống phá của các thế lực thù địch."
                          },
                          {
                            q: "Có kiểm tra, thi cuối kỳ không?",
                            a: "Có. Cuối khóa sinh viên sẽ tham gia kiểm tra cả lý thuyết (trắc nghiệm kiến thức quốc phòng – an ninh) và thực hành (điều lệnh đội ngũ, kỹ thuật quân sự cơ bản). Kết quả này cùng với quá trình rèn luyện sẽ được tính vào điểm tổng kết môn."
                          },
                          {
                            q: "Điểm học kỳ quân sự tính thế nào?",
                            a: "Điểm được tính dựa trên nhiều yếu tố: (1) Chuyên cần – tham gia đầy đủ các buổi học, rèn luyện; (2) Ý thức kỷ luật – chấp hành nội quy, giờ giấc, tác phong; (3) Kết quả thi lý thuyết – kiểm tra kiến thức quốc phòng, an ninh; (4) Kết quả thi thực hành – điều lệnh đội ngũ, kỹ thuật quân sự (bắn súng mô phỏng, ném lựu đạn tập...)."
                          },
                          {
                            q: "Nếu bị bệnh hoặc không tham gia được thì sao?",
                            a: "Trong trường hợp sinh viên bị bệnh hoặc có lý do đặc biệt không thể tham gia, cần nộp giấy xác nhận y tế hoặc giấy tờ minh chứng hợp lệ cho Phòng Giáo dục Quân sự. Sinh viên sẽ được sắp xếp tham gia học bù ở khóa sau để hoàn thành đủ số tín chỉ bắt buộc."
                          }
                        ].map((faq, index) => (
                          <div key={index + 10} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === (index + 10) ? null : (index + 10))}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <span className="text-yellow-200 font-semibold">Q{index + 11}: {faq.q}</span>
                              <div className={`transform transition-transform duration-300 ${expandedFAQ === (index + 10) ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {expandedFAQ === (index + 10) && (
                              <div className="p-4 pt-0 border-t border-slate-600/30">
                                <p className="text-slate-300 flex items-start">
                                  <span className="text-yellow-400 mr-2">👉</span>
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Về kỷ luật & quy định */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">4</span>
                        </div>
                        Về kỷ luật & quy định
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Có được phép ra ngoài trong thời gian học không?",
                            a: "Không. Trong suốt thời gian học kỳ quân sự, sinh viên phải ăn ở tập trung trong khuôn viên Trường Quân sự Quân khu 7. Chỉ khi có lý do chính đáng (ốm đau, việc gia đình khẩn cấp...) và có giấy phép từ Ban chỉ huy đơn vị hoặc Phòng Giáo dục Quân sự thì mới được ra ngoài."
                          },
                          {
                            q: "Có bị phạt nếu vi phạm kỷ luật không?",
                            a: "Có. Sinh viên vi phạm kỷ luật (đi trễ, sử dụng điện thoại trong giờ học, không chấp hành điều lệnh, vi phạm giờ giấc, hút thuốc trong khu vực cấm...) sẽ bị nhắc nhở, lập biên bản, hạ điểm rèn luyện, thậm chí cảnh cáo trước tập thể. Các trường hợp nặng có thể bị buộc học lại khóa sau."
                          },
                          {
                            q: "Có phải cắt tóc ngắn không?",
                            a: "Nam sinh bắt buộc phải cắt tóc gọn gàng, không để dài quá chuẩn quân đội. Nữ sinh không cần cắt tóc ngắn nhưng phải buộc gọn khi học tập và huấn luyện, đồng thời không nhuộm tóc màu quá nổi bật. Mục tiêu là giữ tác phong chỉnh tề, nghiêm túc trong môi trường quân đội."
                          },
                          {
                            q: "Có giới nghiêm không?",
                            a: "Có. Tất cả sinh viên phải tuân thủ giờ giấc sinh hoạt tập trung. Thường buổi tối tắt đèn, đi ngủ trước 22h00, buổi sáng báo thức lúc 5h00. Ngoài khung giờ này, sinh viên không được tự ý ra ngoài khu ký túc xá hoặc gây mất trật tự."
                          }
                        ].map((faq, index) => (
                          <div key={index + 14} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === (index + 14) ? null : (index + 14))}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <span className="text-yellow-200 font-semibold">Q{index + 15}: {faq.q}</span>
                              <div className={`transform transition-transform duration-300 ${expandedFAQ === (index + 14) ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {expandedFAQ === (index + 14) && (
                              <div className="p-4 pt-0 border-t border-slate-600/30">
                                <p className="text-slate-300 flex items-start">
                                  <span className="text-yellow-400 mr-2">👉</span>
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Về chuẩn bị cá nhân */}
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">5</span>
                        </div>
                        Về chuẩn bị cá nhân
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Nhà trường có phát quân phục không?",
                            a: "Có. Khi nhập học, sinh viên sẽ được cấp phát quân phục gồm: quần áo rằn ri hoặc xanh bộ đội, mũ cứng, thắt lưng, giày thể thao/giày bata và các phụ kiện cơ bản. Toàn bộ sinh viên phải mặc đồng bộ theo quy định trong suốt thời gian học."
                          },
                          {
                            q: "Sinh viên cần mang theo những gì?",
                            a: "Sinh viên cần chuẩn bị vật dụng cá nhân như: quần áo lót, tất, khăn tắm, dép đi trong nhà, đồ vệ sinh cá nhân (xà phòng, bàn chải, sữa tắm, dầu gội...), thuốc cá nhân nếu có bệnh lý riêng, bình nước cá nhân, ổ cắm điện (dây kéo dài), quạt mini cắm điện/USB và một ít đồ dùng học tập (sổ, bút)."
                          },
                          {
                            q: "Có cần mang nhiều tiền không?",
                            a: "Không cần mang nhiều tiền mặt vì mọi chi phí chính (ăn ở, quân phục) đã được nhà trường bố trí. Sinh viên chỉ nên mang theo một ít tiền mặt để chi tiêu nhỏ (nước uống thêm, đồ ăn vặt trong căn tin), và mang thẻ ATM để tiện rút khi cần."
                          },
                          {
                            q: "Có cần mang gối, chăn không?",
                            a: "Trường quân sự sẽ cấp chăn, màn, gối tiêu chuẩn quân đội. Tuy nhiên, nhiều sinh viên thường mang thêm gối nhỏ hoặc chăn mỏng cá nhân để cảm thấy thoải mái hơn khi ngủ, nhất là trong những ngày nắng nóng."
                          }
                        ].map((faq, index) => (
                          <div key={index + 18} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === (index + 18) ? null : (index + 18))}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-300"
                            >
                              <span className="text-yellow-200 font-semibold">Q{index + 19}: {faq.q}</span>
                              <div className={`transform transition-transform duration-300 ${expandedFAQ === (index + 18) ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {expandedFAQ === (index + 18) && (
                              <div className="p-4 pt-0 border-t border-slate-600/30">
                                <p className="text-slate-300 flex items-start">
                                  <span className="text-yellow-400 mr-2">👉</span>
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-400/30 p-6 rounded-xl text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4">
                        <Award className="w-6 h-6 text-slate-900" />
                      </div>
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">Tổng cộng 22 câu hỏi thường gặp</h4>
                      <p className="text-slate-300 text-sm">
                        Nếu có thêm câu hỏi nào khác, hãy liên hệ với phòng đào tạo để được hỗ trợ chi tiết
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-green-400 mb-4">Thông tin liên hệ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-800/50 p-6 rounded-lg">
                        <h4 className="text-yellow-400 font-semibold mb-4">Phòng Giáo dục Quân sự</h4>
                        <div className="space-y-2 text-green-100">
                          <p><strong>Địa chỉ:</strong> Tòa nhà A, Tầng 2</p>
                          <p><strong>Điện thoại:</strong> 024.xxxx.xxxx</p>
                          <p><strong>Email:</strong> quansu@university.edu.vn</p>
                          <p><strong>Giờ làm việc:</strong> 8:00 - 17:00</p>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 p-6 rounded-lg">
                        <h4 className="text-yellow-400 font-semibold mb-4">Giảng viên phụ trách</h4>
                        <div className="space-y-2 text-green-100">
                          <p><strong>Đại úy:</strong> Nguyễn Văn A</p>
                          <p><strong>Trung úy:</strong> Trần Thị B</p>
                          <p><strong>Thượng sĩ:</strong> Lê Văn C</p>
                          <p><strong>Email hỗ trợ:</strong> support@university.edu.vn</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "supplies" && (
                  <div className="space-y-8">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold text-yellow-400 mb-2">Dự kiến vật phẩm và tính tiền</h3>
                      {isAdminMode && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/40 rounded-lg">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-red-300 text-sm font-semibold">ADMIN MODE: CRUD Enabled</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-400/40 p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-2xl font-bold text-yellow-300 mb-2">Tổng chi phí dự kiến</h4>
                          <p className="text-slate-300">Chỉnh sửa số lượng và giá để tính toán chi phí</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-yellow-400">{formatPrice(getTotalPrice())}</div>
                          <div className="text-sm text-slate-400">
                            {Object.values(defaultItems).flat().reduce((acc, item) => acc + item.quantity, 0)} sản phẩm
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                      {Object.entries(defaultItems).map(([categoryTitle, items], categoryIndex) => {
                        const categoryTotal = getCategoryTotal(categoryTitle);
                        
                        return (
                          <div key={categoryIndex} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-b border-slate-600/30 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                                    <Trophy className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-yellow-300">{categoryTitle}</h4>
                                    <p className="text-xs text-slate-400">{items.length} sản phẩm</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-yellow-400">{formatPrice(categoryTotal)}</div>
                                  <div className="text-xs text-slate-400">
                                    {items.reduce((sum, item) => sum + item.quantity, 0)} món
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4">

                            {/* Quick Actions - Only show in Admin Mode */}
                            {isAdminMode && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                <button
                                  onClick={() => {
                                    Object.keys(defaultItems[categoryTitle] || {}).forEach(() => {
                                      defaultItems[categoryTitle].forEach(item => {
                                        updateItemQuantity(categoryTitle, item.name, 0);
                                      });
                                    });
                                  }}
                                  className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded border border-red-500/30 transition-colors"
                                >
                                Xóa hết SL
                              </button>
                              <button
                                onClick={() => {
                                  const factor = prompt("Nhân tất cả số lượng với:", "2");
                                  if (factor && !isNaN(Number(factor))) {
                                    defaultItems[categoryTitle].forEach(item => {
                                      updateItemQuantity(categoryTitle, item.name, Math.round(item.quantity * Number(factor)));
                                    });
                                  }
                                }}
                                className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded border border-blue-500/30 transition-colors"
                              >
                                Nhân SL
                              </button>
                              <button
                                onClick={() => {
                                  const percentage = prompt("Tăng/giảm giá % (ví dụ: 10 để tăng 10%, -20 để giảm 20%):", "10");
                                  if (percentage && !isNaN(Number(percentage))) {
                                    defaultItems[categoryTitle].forEach(item => {
                                      const newPrice = Math.round(item.price * (1 + Number(percentage) / 100));
                                      updateItemPrice(categoryTitle, item.name, newPrice);
                                    });
                                  }
                                }}
                                className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1 rounded border border-green-500/30 transition-colors"
                              >
                                Điều chỉnh giá %
                              </button>
                            </div>
                            )}

                            {/* Items Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-slate-600/30">
                                    <th className="text-left py-2 px-3 text-slate-400 text-sm font-medium">Vật phẩm</th>
                                    <th className="text-center py-2 px-3 text-slate-400 text-sm font-medium w-20">SL</th>
                                    <th className="text-center py-2 px-3 text-slate-400 text-sm font-medium w-24">Giá</th>
                                    <th className="text-right py-2 px-3 text-slate-400 text-sm font-medium w-24">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map((item, itemIndex) => (
                                    <tr key={itemIndex} className="border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors">
                                      <td className="py-3 px-3">
                                        <span className="text-yellow-200 text-sm font-medium">{item.name}</span>
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          value={item.quantity}
                                          onChange={isAdminMode ? (e) => updateItemQuantity(categoryTitle, item.name, parseInt(e.target.value) || 0) : undefined}
                                          onKeyDown={isAdminMode ? (e) => {
                                            if (e.key === 'ArrowUp') {
                                              e.preventDefault();
                                              updateItemQuantity(categoryTitle, item.name, item.quantity + 1);
                                            } else if (e.key === 'ArrowDown') {
                                              e.preventDefault();
                                              updateItemQuantity(categoryTitle, item.name, Math.max(0, item.quantity - 1));
                                            }
                                          } : undefined}
                                          readOnly={!isAdminMode}
                                          className={`w-16 border rounded px-2 py-1 text-sm text-center focus:outline-none ${
                                            isAdminMode 
                                              ? 'bg-slate-800/50 border-slate-600/50 text-white focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20' 
                                              : 'bg-slate-700/30 border-slate-600/30 text-slate-400 cursor-not-allowed'
                                          }`}
                                        />
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        <input
                                          type="number"
                                          min="0"
                                          step="1000"
                                          value={item.price}
                                          onChange={isAdminMode ? (e) => updateItemPrice(categoryTitle, item.name, parseInt(e.target.value) || 0) : undefined}
                                          onKeyDown={isAdminMode ? (e) => {
                                            if (e.key === 'ArrowUp') {
                                              e.preventDefault();
                                              updateItemPrice(categoryTitle, item.name, item.price + 1000);
                                            } else if (e.key === 'ArrowDown') {
                                              e.preventDefault();
                                              updateItemPrice(categoryTitle, item.name, Math.max(0, item.price - 1000));
                                            }
                                          } : undefined}
                                          readOnly={!isAdminMode}
                                          className={`w-20 border rounded px-2 py-1 text-sm text-center focus:outline-none ${
                                            isAdminMode 
                                              ? 'bg-slate-800/50 border-slate-600/50 text-white focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20' 
                                              : 'bg-slate-700/30 border-slate-600/30 text-slate-400 cursor-not-allowed'
                                          }`}
                                        />
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        <span className="text-yellow-400 font-medium text-sm">
                                          {(item.quantity * item.price).toLocaleString('vi-VN')}₫
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            </div>

                            {/* Category Total */}
                            <div className="bg-slate-700/20 px-4 py-3 border-t border-slate-600/30">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-medium text-sm">Tổng danh mục:</span>
                                <span className="text-lg font-bold text-yellow-400">
                                  {formatPrice(categoryTotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Final Summary */}
                    {getTotalPrice() > 0 && (
                      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/40 p-6 rounded-xl">
                        <div className="text-center">
                          <h4 className="text-2xl font-bold text-green-400 mb-2">Tổng chi phí cần chuẩn bị</h4>
                          <div className="text-4xl font-bold text-green-300 mb-2">{formatPrice(getTotalPrice())}</div>
                          <p className="text-slate-300 text-sm">
                            Đây chỉ là ước tính, giá thực tế có thể thay đổi tuỳ theo nơi mua và chất lượng sản phẩm
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Item Modal */}
                {showAddItemModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold text-yellow-400 mb-4">Thêm sản phẩm - {selectedCategory}</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name') as string;
                        const quantity = parseInt(formData.get('quantity') as string);
                        const price = parseInt(formData.get('price') as string);
                        addItemToCart(name, quantity, price);
                      }}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-yellow-300 mb-2">Tên sản phẩm</label>
                            <input
                              type="text"
                              name="name"
                              required
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                              placeholder="Nhập tên sản phẩm..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-yellow-300 mb-2">Số lượng</label>
                            <input
                              type="number"
                              name="quantity"
                              required
                              min="1"
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                              placeholder="Nhập số lượng..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-yellow-300 mb-2">Giá tiền (VND)</label>
                            <input
                              type="number"
                              name="price"
                              required
                              min="0"
                              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                              placeholder="Nhập giá tiền..."
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => setShowAddItemModal(false)}
                            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-4 py-3 rounded-lg font-semibold transition-all duration-300"
                          >
                            Thêm vào danh sách
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center mb-6">
                      <h3 className="text-3xl font-bold text-yellow-400">Tài liệu quan trọng</h3>
                      {isAdminMode && (
                        <div className="ml-4 flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-sm hover:bg-green-500/30 transition-all duration-200">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Thêm tài liệu
                          </button>
                          <button className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-all duration-200">
                            <Edit className="w-4 h-4 inline mr-1" />
                            Quản lý
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Documents List */}
                    <div className="space-y-6">
                      {[
                        {
                          title: "Hướng dẫn chuẩn bị quân sự",
                          description: "Tài liệu chi tiết về các bước chuẩn bị trước khi tham gia khóa đào tạo quân sự, bao gồm giấy tờ, vật dụng cá nhân và tình trạng sức khỏe.",
                          fileSize: "2.5 MB",
                          fileType: "PDF",
                          downloadUrl: "#",
                          icon: Shield,
                          color: "from-blue-500 to-blue-600"
                        },
                        {
                          title: "Quy định và nội quy",
                          description: "Bộ quy tắc và nội quy cần tuân thủ trong suốt quá trình đào tạo, bao gồm giờ giấc, trang phục và các hoạt động hàng ngày.",
                          fileSize: "1.8 MB",
                          fileType: "PDF",
                          downloadUrl: "#",
                          icon: BookOpen,
                          color: "from-red-500 to-red-600"
                        },
                        {
                          title: "Lịch trình đào tạo chi tiết",
                          description: "Thời khóa biểu đầy đủ của khóa đào tạo quân sự, bao gồm các môn học, thời gian và địa điểm thực hiện.",
                          fileSize: "3.2 MB",
                          fileType: "PDF",
                          downloadUrl: "#",
                          icon: Clock,
                          color: "from-green-500 to-green-600"
                        },
                        {
                          title: "Danh sách vật phẩm cần thiết",
                          description: "Bảng kiểm tra đầy đủ các vật phẩm cá nhân, dụng cụ học tập và trang thiết bị cần chuẩn bị.",
                          fileSize: "1.1 MB",
                          fileType: "PDF",
                          downloadUrl: "#",
                          icon: Trophy,
                          color: "from-purple-500 to-purple-600"
                        },
                        {
                          title: "Mẫu đơn đăng ký tham gia",
                          description: "Form đăng ký chính thức để tham gia khóa đào tạo quân sự, bao gồm thông tin cá nhân và cam kết.",
                          fileSize: "0.5 MB",
                          fileType: "DOC",
                          downloadUrl: "#",
                          icon: Users,
                          color: "from-orange-500 to-orange-600"
                        }
                      ].map((doc, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/40 rounded-xl overflow-hidden hover:border-yellow-400/40 transition-all duration-300">
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className={`w-12 h-12 bg-gradient-to-br ${doc.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <doc.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xl font-bold text-yellow-300 mb-2">{doc.title}</h4>
                                  <p className="text-slate-300 text-sm mb-3 leading-relaxed">{doc.description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                                    <span className="flex items-center">
                                      <FileText className="w-3 h-3 mr-1" />
                                      {doc.fileType}
                                    </span>
                                    <span>{doc.fileSize}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  // Simulate download
                                  const link = window.document.createElement('a');
                                  link.href = doc.downloadUrl;
                                  link.download = `${doc.title}.${doc.fileType.toLowerCase()}`;
                                  window.document.body.appendChild(link);
                                  link.click();
                                  window.document.body.removeChild(link);
                                }}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ml-4 flex-shrink-0"
                              >
                                <Download className="w-4 h-4" />
                                Tải về
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Important Notice */}
                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-400/40 p-6 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-yellow-300 mb-2">Lưu ý quan trọng</h4>
                          <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Vui lòng đọc kỹ tất cả tài liệu trước khi tham gia khóa đào tạo</li>
                            <li>• In và mang theo các mẫu đơn đã điền đầy đủ thông tin</li>
                            <li>• Liên hệ bộ phận hỗ trợ nếu có thắc mắc về tài liệu</li>
                            <li>• Tài liệu có thể được cập nhật, kiểm tra phiên bản mới nhất</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30"
          initial="hidden"
          animate="visible"
          variants={bounceIn}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="mb-6"
            {...floatingAnimation}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Flag className="w-16 h-16 mx-auto text-green-400 mb-4" />
            </motion.div>
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            variants={fadeInUp}
          >
            Sẵn Sàng Tham Gia Khóa Quân Sự?
          </motion.h2>
          <motion.p 
            className="text-green-100 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Đăng ký ngay để nhận thông tin chi tiết về chương trình và chuẩn bị cho hành trình rèn luyện bản thân.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerChildrenFast}
          >
            <motion.div variants={slideInUp}>
              <motion.button
                type="button"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                ĐĂNG KÝ NGAY
              </motion.button>
            </motion.div>
            <motion.div variants={slideInUp}>
              <motion.button
                type="button"
                className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                TÌM HIỂU THÊM
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">🔐 Admin Access</h3>
            <p className="text-slate-300 text-sm mb-4 text-center">
              Nhập mật khẩu để truy cập chế độ Admin
            </p>
            
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="Nhập mật khẩu admin..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordCancel}
                  className="flex-1 px-4 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-colors"
                >
                  Truy cập
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Military;

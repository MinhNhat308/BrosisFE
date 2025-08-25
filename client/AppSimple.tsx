import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple components
const SimpleNav = () => (
  <nav className="bg-blue-600 text-white p-4">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <h1 className="text-xl font-bold">FPT University</h1>
      <div className="space-x-4">
        <a href="/" className="hover:underline">Trang chủ</a>
        <a href="/military" className="hover:underline">Quân sự</a>
        <a href="/events" className="hover:underline">Sự kiện</a>
        <a href="/blog" className="hover:underline">Blog</a>
      </div>
    </div>
  </nav>
);

const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <SimpleNav />
    <div className="max-w-6xl mx-auto py-20 px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Chào mừng đến với FPT University
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Trải nghiệm giáo dục hiện đại và chất lượng cao
      </p>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Chương trình Quân sự</h3>
          <p className="text-gray-600">Rèn luyện ý chí và kỷ luật</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Sự kiện</h3>
          <p className="text-gray-600">Các hoạt động học tập và giải trí</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Blog</h3>
          <p className="text-gray-600">Chia sẻ kiến thức và kinh nghiệm</p>
        </div>
      </div>
    </div>
  </div>
);

const MilitaryPage = () => (
  <div className="min-h-screen bg-gray-50">
    <SimpleNav />
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Chương trình Giáo dục Quốc phòng</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">4</h3>
          <p className="text-gray-600">Tuần Huấn Luyện</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-2">98%</h3>
          <p className="text-gray-600">Tỷ Lệ Đỗ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-3xl font-bold text-red-600 mb-2">15</h3>
          <p className="text-gray-600">Môn Học Quân Sự</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-3xl font-bold text-purple-600 mb-2">1000+</h3>
          <p className="text-gray-600">Sinh Viên Tham Gia</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Giới thiệu chương trình</h2>
        <p className="text-gray-600 leading-relaxed">
          Chương trình Giáo dục Quốc phòng tại FPT University là một phần quan trọng trong quá trình đào tạo,
          giúp sinh viên phát triển toàn diện về thể chất, tinh thần và kỹ năng sống.
        </p>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-50">
    <SimpleNav />
    <div className="max-w-6xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Không tìm thấy trang</h1>
      <p className="text-gray-600">Trang bạn đang tìm kiếm không tồn tại.</p>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/military" element={<MilitaryPage />} />
      <Route path="/events" element={<HomePage />} />
      <Route path="/blog" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);

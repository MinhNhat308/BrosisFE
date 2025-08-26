import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  BookOpen,
  Users,
  Shield,
  Sparkles,
  Settings
} from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { 
    isAdminMode, 
    showPasswordModal, 
    passwordInput, 
    passwordError, 
    setPasswordInput,
    handlePasswordSubmit, 
    handlePasswordCancel, 
    handleAdminToggle 
  } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      path: "/",
      label: "Trang chủ",
      icon: Home,
    },
    {
      path: "/events",
      label: "Sự kiện",
      icon: Calendar,
    },
    {
      path: "/blog",
      label: "Blog",
      icon: BookOpen,
    },
    {
      path: "/students",
      label: "Sinh viên",
      icon: Users,
    },
    {
      path: "/military",
      label: "Quân sự",
      icon: Shield,
    },
    {
      path: "/contact",
      label: "Liên hệ",
      icon: Sparkles,
    },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled 
          ? "backdrop-blur-md bg-white/90 shadow-lg border-b border-unicorn-pink/20" 
          : "bg-white/95"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-unicorn-pink to-pink-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-unicorn-pink group-hover:text-unicorn-pink-dark">
              BroSis
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95",
                      isActive 
                        ? "bg-unicorn-pink text-white shadow-md hover:shadow-lg" 
                        : "text-unicorn-pink hover:bg-unicorn-pink/10 hover:text-unicorn-pink-dark hover:shadow-sm"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Admin Button */}
            <Button
              onClick={handleAdminToggle}
              variant="ghost"
              className={cn(
                "flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95",
                isAdminMode 
                  ? "bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg" 
                  : "text-orange-500 hover:bg-orange-500/10 hover:text-orange-600 border border-orange-500/30 hover:shadow-sm"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>{isAdminMode ? '👑 Admin' : '🔑 Admin'}</span>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-unicorn-pink hover:bg-unicorn-pink/10 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-unicorn-pink/20 py-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full flex items-center justify-center space-x-2 h-12 transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]",
                      isActive 
                        ? "bg-unicorn-pink text-white shadow-md hover:shadow-lg" 
                        : "text-unicorn-pink hover:bg-unicorn-pink/10 hover:shadow-sm"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Admin Button Mobile */}
            <Button
              onClick={handleAdminToggle}
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-center space-x-2 h-12 transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]",
                isAdminMode 
                  ? "bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg" 
                  : "text-orange-500 hover:bg-orange-500/10 border border-orange-500/30 hover:shadow-sm"
              )}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">{isAdminMode ? '👑 Admin' : '🔑 Admin'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nhập mật khẩu để truy cập chế độ Admin
            </h3>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Mật khẩu..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Xác nhận
              </button>
              <button
                onClick={handlePasswordCancel}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  BookOpen,
  Users,
  Shield,
  Sparkles
} from "lucide-react";

export function Navigation() {
  const location = useLocation();

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
    <nav className="bg-white border-b border-unicorn-pink/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent">
              Unicorn Team
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
                      "flex items-center space-x-2 transition-all duration-200",
                      isActive 
                        ? "bg-unicorn-pink text-white shadow-md" 
                        : "text-unicorn-pink hover:bg-unicorn-pink/10 hover:text-unicorn-pink-dark"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-unicorn-pink hover:bg-unicorn-pink/10"
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
                      "w-full flex items-center justify-center space-x-2 h-12",
                      isActive 
                        ? "bg-unicorn-pink text-white" 
                        : "text-unicorn-pink hover:bg-unicorn-pink/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import FPTChatbot from "@/components/FPTChatbot";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetailTemp";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Students from "./pages/Students";
import Military from "./pages/MilitarySimple";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/students" element={<Students />} />
            <Route path="/military" element={<Military />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {/* FPT Chatbot - Available on all pages */}
        <FPTChatbot />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);

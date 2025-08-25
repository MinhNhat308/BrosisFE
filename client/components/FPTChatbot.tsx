import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import './chatbot-scroll.css';
import { chatbotData } from "./FPTChatbot-data";
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Bot,
  User,
  Search,
  Globe,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'warning' | 'info' | 'success' | 'research';
  isResearching?: boolean;
}

const FPTChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Xin chào! Tôi là FPT Assistant. Tôi có thể giúp bạn tìm hiểu về FPT University. Hãy hỏi tôi bất cứ điều gì!',
      sender: 'bot',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced bot response generation
  const generateBotResponse = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();

    // Tìm trong chatbotData - guard in case ChatCategory doesn't have keywords
        const found = chatbotData.find((cat: any) =>
          Array.isArray(cat.keywords) && cat.keywords.some((kw: string) => lowerInput.includes(kw))
        );

    if (found) {
      // Some ChatCategory definitions may not include 'content'; try common alternatives and fall back to empty string
      const content =
        (found as any).content ??
        (found as any).description ??
        (found as any).answer ??
        '';
      return `${found.title}\n\n${content}`;
    }

    // Nếu không khớp keyword nào → trả lời mặc định
    return `🤔 Tôi có thể giúp bạn về:
- Học tập & Đào tạo
- Khảo thí
- Dịch vụ sinh viên
- Thư viện
- Hợp tác quốc tế & PDP
- Quan hệ doanh nghiệp
- Phòng IT
- Cơ sở vật chất & đời sống
- Sự kiện & hoạt động
- FAQ`;
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await generateBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'success'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Auto scroll to bottom
  useEffect(() => {
    const scrollContainer = messagesEndRef.current?.parentElement;
    if (scrollContainer) {
      const isNearBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 100;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <div className="chatbot-container">
        <Button
          onClick={() => setIsOpen(true)}
          className="chatbot-button rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <Card className="chatbot-window w-96 h-[500px] shadow-xl border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">FPT Assistant</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-200">Online</span>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-7 w-7 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-[430px] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 chatbot-scroll">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : message.type === 'warning' 
                        ? 'bg-red-500' 
                        : 'bg-purple-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`p-3 rounded-lg text-sm message-scroll ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : message.type === 'warning'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800'
                      } ${message.text.length > 300 ? 'max-h-40 overflow-y-auto' : ''}`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi tôi về FPT University..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isTyping || isResearching}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping || isResearching}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-2 max-h-16 overflow-y-auto">
                {['Học phí mới nhất', 'Tuyển sinh 2025', 'Cơ sở FPT', 'Tư vấn laptop', 'Sự kiện'].map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors text-xs flex-shrink-0"
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
              
              {/* Helper text */}
              <div className="text-xs text-gray-500 text-center mt-2">
                💡 Cuộn chuột để xem tin nhắn cũ • 📜 Tin nhắn dài có thể cuộn riêng
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FPTChatbot;

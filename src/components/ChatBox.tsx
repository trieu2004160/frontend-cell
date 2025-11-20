import { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./ChatBox.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  url: string;
  description: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  products?: Product[];
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Load messages from localStorage on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatbox_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch {
        return [
          {
            id: "1",
            text: "Xin chào! Tôi là trợ lý ảo của CellphoneS. Tôi có thể giúp gì cho bạn?",
            sender: "bot",
            timestamp: new Date(),
          },
        ];
      }
    }
    return [
      {
        id: "1",
        text: "Xin chào! Tôi là trợ lý ảo của CellphoneS. Tôi có thể giúp gì cho bạn?",
        sender: "bot",
        timestamp: new Date(),
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatbox_messages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call Python AI API
      const response = await fetch("http://localhost:8000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.data.text,
          sender: "bot",
          timestamp: new Date(),
          products: data.data.products || [],
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || "API error");
      }
    } catch (error: any) {
      console.error("❌ Chat API Error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });

      // Determine error message based on error type
      let errorText = "Xin lỗi, không thể kết nối với AI. ";

      if (error.message.includes("Failed to fetch")) {
        errorText +=
          "Vui lòng kiểm tra:\n1. Python server đã chạy chưa? (http://localhost:8000)\n2. CORS đã được config chưa?";
      } else if (error.message.includes("HTTP error")) {
        errorText += `Server trả về lỗi: ${error.message}`;
      } else {
        errorText += "Vui lòng thử lại sau.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110">
              <MessageOutlined className="text-white text-2xl" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden chatbox-container">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  size={40}
                  src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/Logo-CPS-1.png"
                  className="bg-white"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">
                  CellphoneS Support
                </h3>
                <p className="text-white text-xs opacity-90">Đang hoạt động</p>
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.sender === "user"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  } rounded-2xl px-4 py-2.5`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.products.map((product) => (
                        <Link
                          key={product.id}
                          to={product.url}
                          className="block bg-white border rounded-lg p-2 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-24 object-contain mb-2"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/default-product.png";
                            }}
                          />
                          <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-sm font-bold text-red-600">
                            {product.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}

                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                className="flex-1 rounded-xl"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-red-500 hover:bg-red-600 h-auto rounded-xl px-4"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Nhấn Enter để gửi, Shift + Enter để xuống dòng
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaRobot, FaPaperPlane } from "react-icons/fa";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(""); // Clear input immediately

    // 1. Add User message immediately (Optimistic UI)
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4002/bot/v1/message", {
        text: userMessage,
      });

      if (res.status === 200) {
        // 2. Add Bot message when it arrives
        setMessages((prev) => [
          ...prev,
          { text: res.data.botMessage, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error.",
          sender: "bot",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    // Background: Deep "Volcanic" Gradient (Red/Maroon to Black)
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900 via-neutral-900 to-black text-gray-100 font-sans">
      {/* Navbar: Glassmorphism */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-lg bg-black/40 border-b border-white/10 z-20 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Robot Icon Background */}
            <div className="bg-gradient-to-tr from-yellow-500 to-red-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <FaRobot size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide">
              {/* Text Gradient: Yellow to Red */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                CUET
              </span>
              <span className="text-gray-300">_BOT</span>
            </h1>
          </div>
          <FaUserCircle
            size={32}
            className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
          />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto pt-28 pb-32 px-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col space-y-6">
          {/* Empty State / Welcome */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
              {/* Floating Icon */}
              <div className="w-24 h-24 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-6 animate-bounce-slow">
                <FaRobot size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2">
                Hello, Student! 👋
              </h2>
              <p className="text-lg text-gray-400 max-w-md">
                I am your{" "}
                <span className="text-yellow-400 font-semibold">
                  CUET Assistant
                </span>
                . Ask me about exams, syllabus, transport, or facilities.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative px-6 py-3 rounded-2xl max-w-[80%] text-base shadow-md leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-tr-sm" // User: Orange/Red Gradient
                    : msg.isError
                    ? "bg-red-950/80 border border-red-500/50 text-red-200 rounded-tl-sm"
                    : "bg-gray-800/60 backdrop-blur-sm border border-white/10 text-gray-100 rounded-tl-sm" // Bot: Glass
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-20 px-4 pb-6 pt-2">
        <div className="max-w-3xl mx-auto">
          {/* Input Container */}
          <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl shadow-orange-900/20 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all duration-300">
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-6 py-4 outline-none rounded-full text-lg"
              placeholder="Ask about CUET..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className={`mr-2 p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                input.trim() && !loading
                  ? "bg-gradient-to-r from-yellow-500 to-red-600 text-white shadow-lg hover:scale-110 hover:shadow-orange-500/40"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane
                size={18}
                className={input.trim() && !loading ? "ml-1" : ""}
              />
            </button>
          </div>

          <div className="text-center mt-2">
            <span className="text-xs text-gray-500">
              Powered by CUET AI Dept
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Bot;

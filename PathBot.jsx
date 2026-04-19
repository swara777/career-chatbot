import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const PathBot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hi ${user?.name || 'there'}! I'm PathBot, your personal career advisor. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const context = `User Information:
- Name: ${user?.name}
- Current Standard: ${user?.currentStandard}
- Interests: ${user?.interests?.join(', ')}
- Current Roadmap: ${user?.currentRoadmap?.careerTitle || 'None selected yet'}

User Question: ${inputValue}

Provide personalized career guidance based on the user's profile.`;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pathbot/chat`,
        { message: inputValue, context },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: response.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-[#10B981]/50 transition z-40"
        >
          <span className="text-3xl">🤖</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-[#0F172A] border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h3 className="text-white font-bold">PathBot</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-white/10 text-gray-200 border border-white/20'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 border border-white/20 px-4 py-2 rounded-lg">
                  <span className="inline-block animate-bounce">●</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>
                    ●
                  </span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>
                    ●
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-white/20 p-4 bg-[#0F172A] rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PathBot;
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm GlamArt AI 💖\nAsk me about makeup, skincare, fashion, hairstyles, outfits, and beauty tips ✨",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input;

    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chatbot/chat',
        {
          message: currentMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = {
        role: 'assistant',
        content:
          response?.data?.data?.message ||
          '✨ No response from AI',
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {

      console.error(
        'CHATBOT ERROR:',
        error?.response?.data || error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Oops! Something went wrong. Please try again 💖',
        },
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  // TOGGLE CHAT
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  // CLEAR CHAT
  const clearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi! I'm GlamArt AI 💖\nAsk me about makeup, skincare, fashion, hairstyles, outfits, and beauty tips ✨",
      },
    ]);
  };

  return (
    <div>

      {/* Floating Button */}
      <button
        onClick={toggleChatbot}
        className="
          fixed bottom-6 right-6 z-50
          w-16 h-16
          rounded-full
          bg-gradient-to-r from-pink-500 to-purple-500
          text-white
          shadow-2xl
          flex items-center justify-center
          text-2xl
          hover:scale-110
          transition-all duration-300
        "
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6 z-50
            w-[360px] h-[600px]
            bg-white
            rounded-3xl
            shadow-2xl
            border border-gray-100
            flex flex-col
            overflow-hidden
          "
        >

          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                ✨
              </div>

              <div>
                <h3 className="text-white font-bold">
                  GlamArt AI
                </h3>

                <p className="text-white/80 text-xs">
                  Beauty Assistant 💖
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={clearHistory}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                🗑️
              </button>

              <button
                onClick={toggleChatbot}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                ✕
              </button>

            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`
                    max-w-[85%]
                    p-3
                    rounded-2xl
                    whitespace-pre-wrap
                    leading-relaxed
                    text-sm
                    ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }
                  `}
                >
                  {message.content}
                </div>

              </div>

            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">

                <div className="bg-white p-3 rounded-2xl shadow-sm">

                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">

            <div className="flex gap-2">

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !isLoading
                  ) {
                    sendMessage();
                  }
                }}
                placeholder="Ask about beauty, skincare..."
                className="
                  flex-1
                  border border-gray-200
                  rounded-xl
                  px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-pink-500
                "
              />

              <button
                onClick={sendMessage}
                disabled={
                  isLoading || !input.trim()
                }
                className="
                  px-4
                  rounded-xl
                  bg-gradient-to-r from-pink-500 to-purple-500
                  text-white
                  font-semibold
                  disabled:opacity-50
                "
              >
                ➤
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
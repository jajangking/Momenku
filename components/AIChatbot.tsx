import { useState, useRef, useEffect } from 'react';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  messages: { id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }[];
  isProcessing: boolean;
}

export default function AIChatbot({ 
  isOpen, 
  onClose, 
  onSendMessage, 
  messages, 
  isProcessing 
}: AIChatbotProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 text-2xl">🤖</div>
            <div>
              <h3 className="font-bold">AI Penulis Cerita</h3>
              <p className="text-xs opacity-80">Asisten Anda saat menulis</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💬</div>
              <p className="font-medium">Selamat datang di AI Penulis Cerita!</p>
              <p className="text-sm mt-1">Tanyakan apa saja tentang menulis cerita Anda</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              <button
                onClick={() => onSendMessage("Bagaimana cara menulis cerita yang menarik?")}
                className="text-left p-3 bg-white dark:bg-gray-600 rounded-lg shadow text-xs hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                Bagaimana cara menulis cerita yang menarik?
              </button>
              <button
                onClick={() => onSendMessage("Bantu saya menyusun alur cerita keluarga")}
                className="text-left p-3 bg-white dark:bg-gray-600 rounded-lg shadow text-xs hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                Bantu saya menyusun alur cerita keluarga
              </button>
              <button
                onClick={() => onSendMessage("Apa yang sebaiknya saya tulis di awal cerita?")}
                className="text-left p-3 bg-white dark:bg-gray-600 rounded-lg shadow text-xs hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                Apa yang sebaiknya saya tulis di awal cerita?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-purple-500 text-white rounded-tr-none' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-2 rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan Anda..."
            disabled={isProcessing}
            className="flex-grow px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || !inputMessage.trim()}
            className={`px-4 py-2 rounded-r-lg text-white font-medium text-sm ${
              isProcessing || !inputMessage.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
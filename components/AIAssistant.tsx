import { useState, useEffect } from 'react';
import AIChatbot from './AIChatbot';

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  onSimplify: () => void;
  onCleanUp: () => void;
  onFormat: () => void;
  isProcessing: boolean;
  chatMessages: { id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }[];
  onSendMessage: (message: string) => void;
}

export default function AIAssistant({
  onSuggestion,
  onSimplify,
  onCleanUp,
  onFormat,
  isProcessing,
  chatMessages,
  onSendMessage
}: AIAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Handle the different actions
  const handleSimplify = () => {
    onSimplify();
    // Add a message to the chat to indicate the action
    onSendMessage("Bantu saya menyederhanakan teks yang sudah saya tulis agar lebih mudah dipahami.");
  };

  const handleCleanUp = () => {
    onCleanUp();
    // Add a message to the chat to indicate the action
    onSendMessage("Bantu saya merapihkan teks yang sudah saya tulis, perbaiki tata bahasa dan ejaan.");
  };

  const handleFormat = () => {
    onFormat();
    // Add a message to the chat to indicate the action
    onSendMessage("Bantu saya memformat teks yang sudah saya tulis agar lebih rapih dan enak dibaca.");
  };

  return (
    <div className="relative">
      {/* AI Assistant Button */}
      <button
        onClick={() => {
          setIsPanelOpen(!isPanelOpen);
          if (!isPanelOpen) setIsChatOpen(false); // Close chat when opening panel
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="AI Assistant"
      >
        <div className="text-white text-xl">🤖</div>
        {isProcessing && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Quick Action Panel */}
      {isPanelOpen && !isChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 text-2xl">🤖</div>
                <div>
                  <h3 className="font-bold">AI Penulis Cerita</h3>
                  <p className="text-xs opacity-80">Asisten Anda saat menulis</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="text-white hover:text-gray-200 focus:outline-none text-sm underline"
              >
                Buka Chat
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {isProcessing
                  ? "AI sedang memproses permintaan Anda..."
                  : "Bagaimana saya bisa bantu menulis cerita Anda hari ini?"}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSimplify}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    isProcessing
                      ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-800/50 dark:text-purple-300'
                  }`}
                >
                  Buat Mudah Dipahami
                </button>
                <button
                  onClick={handleCleanUp}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    isProcessing
                      ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-800/50 dark:text-green-300'
                  }`}
                >
                  Rapihkan Teks
                </button>
                <button
                  onClick={handleFormat}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg text-sm font-medium col-span-2 ${
                    isProcessing
                      ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-800/50 dark:text-blue-300'
                  }`}
                >
                  Format Rapih
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsChatOpen(true);
                setIsPanelOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-sm"
            >
              Buka Chat untuk Bantuan Lebih Lanjut
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <AIChatbot
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setIsPanelOpen(true); // Show panel again when chat is closed
        }}
        onSendMessage={onSendMessage}
        messages={chatMessages}
        isProcessing={isProcessing}
      />
    </div>
  );
}
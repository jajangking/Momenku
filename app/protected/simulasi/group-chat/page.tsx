'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  personality: string;
}

interface Message {
  id: string;
  sender: string; // 'user' or AI agent name
  content: string;
  timestamp: Date;
}

export default function GroupChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Track if welcome messages have already been initialized
  const [welcomeInitialized, setWelcomeInitialized] = useState(false);

  // Load agents from localStorage (from previous step)
  useEffect(() => {
    const storedSimulation = localStorage.getItem('simulationSetup');
    if (storedSimulation) {
      const { aiAgents } = JSON.parse(storedSimulation);
      setAiAgents(aiAgents);

      // Add welcome messages from AI agents only once
      if (!welcomeInitialized) {
        setTimeout(() => {
          aiAgents.forEach((agent, index) => {
            setTimeout(() => {
              addMessage({
                id: `welcome-${Date.now()}-${index}`,
                sender: agent.name,
                content: `Halo! Saya ${agent.name}, ${agent.role}. ${
                  agent.personality === 'Creative' ? 'Saya siap memberikan ide-ide kreatif!' :
                  agent.personality === 'Analytical' ? 'Saya akan menganalisis setiap situasi secara mendalam.' :
                  agent.personality === 'Empathetic' ? 'Saya siap mendengarkan dan membantu semua pihak.' :
                  'Senang bergabung dalam simulasi ini!'
                }`,
                timestamp: new Date()
              });
            }, 1000 * (index + 1));
          });
        }, 500);
        setWelcomeInitialized(true);
      }
    } else {
      // Fallback to mock agents if no stored data
      const mockAgents: AIAgent[] = [
        {
          id: '1',
          name: 'Sarah',
          role: 'Marketing Manager',
          description: 'Bertanggung jawab atas strategi pemasaran perusahaan',
          personality: 'Creative'
        },
        {
          id: '2',
          name: 'Michael',
          role: 'Finance Manager',
          description: 'Mengelola keuangan dan anggaran perusahaan',
          personality: 'Analytical'
        },
        {
          id: '3',
          name: 'Emma',
          role: 'HR Director',
          description: 'Menangani sumber daya manusia dan rekrutmen',
          personality: 'Empathetic'
        }
      ];

      setAiAgents(mockAgents);

      // Add welcome messages from AI agents only once
      if (!welcomeInitialized) {
        setTimeout(() => {
          mockAgents.forEach((agent, index) => {
            setTimeout(() => {
              addMessage({
                id: `welcome-${Date.now()}-${index}`,
                sender: agent.name,
                content: `Halo! Saya ${agent.name}, ${agent.role}. ${
                  agent.personality === 'Creative' ? 'Saya siap memberikan ide-ide kreatif!' :
                  agent.personality === 'Analytical' ? 'Saya akan menganalisis setiap situasi secara mendalam.' :
                  agent.personality === 'Empathetic' ? 'Saya siap mendengarkan dan membantu semua pihak.' :
                  'Senang bergabung dalam simulasi ini!'
                }`,
                timestamp: new Date()
              });
            }, 1000 * (index + 1));
          });
        }, 500);
        setWelcomeInitialized(true);
      }
    }
  }, [welcomeInitialized]); // Only run when welcomeInitialized changes

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const generateAIResponse = async (message: string, agent: AIAgent) => {
    setIsTyping(true);

    try {
      // Construct the prompt with the agent's role and personality
      const agentContext = `Kamu adalah ${agent.name}, seorang ${agent.role}. ${
        agent.personality === 'Creative' ? 'Kamu sangat kreatif dan suka mencari solusi inovatif.' :
        agent.personality === 'Analytical' ? 'Kamu sangat analitis dan mengandalkan data serta fakta.' :
        agent.personality === 'Empathetic' ? 'Kamu sangat empatik dan memahami perasaan orang lain.' :
        'Kamu sangat profesional dan bertindak sesuai peranmu.'
      }`;

      // Include conversation history for context
      const conversationHistory = messages.slice(-5).map(msg =>
        `${msg.sender}: ${msg.content}`
      ).join('\n');

      const fullPrompt = `${agentContext}\n\nRiwayat percakapan:\n${conversationHistory}\n\nPesan pengguna: ${message}\n\nBalasan dari ${agent.name}:`;

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          systemMessage: agentContext
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mendapatkan respons dari AI');
      }

      const data = await response.json();

      // Add AI's response to the messages
      const aiResponse: Message = {
        id: Date.now().toString(),
        sender: agent.name,
        content: data.text,
        timestamp: new Date()
      };

      addMessage(aiResponse);
      setIsTyping(false);

      // Possibility for another agent to respond to the conversation
      if (Math.random() > 0.5 && aiAgents.length > 1) {
        setTimeout(() => {
          // Select another agent (different from the one who just responded)
          const otherAgents = aiAgents.filter(a => a.name !== agent.name);
          const nextAgent = otherAgents[Math.floor(Math.random() * otherAgents.length)];

          if (nextAgent) {
            generateAIResponse(`Sehubungan dengan pesan terakhir dari ${agent.name}: "${data.text}", apa pendapatmu?`, nextAgent);
          }
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = `Gagal mendapatkan respons dari ${agent.name}: ${error.message}`;

      // Add error message to chat
      const errorResponse: Message = {
        id: Date.now().toString(),
        sender: agent.name,
        content: `Maaf, saya mengalami kendala teknis saat ini. ${error.message}`,
        timestamp: new Date()
      };

      addMessage(errorResponse);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user's message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');

    // Select a random AI agent to respond
    const randomAgent = aiAgents[Math.floor(Math.random() * aiAgents.length)];

    if (randomAgent) {
      await generateAIResponse(inputMessage, randomAgent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToSetup = () => {
    router.push('/protected/simulasi');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-pink-600 dark:bg-gray-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Simulasi Roleplay</h1>
        <button
          onClick={handleBackToSetup}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition"
        >
          Kembali
        </button>
      </div>

      {/* AI Agents Status */}
      <div className="p-3 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {aiAgents.map((agent) => (
            <div
              key={agent.id}
              className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-full text-sm flex items-center"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {agent.name} ({agent.role})
            </div>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-pink-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}
            >
              {message.sender !== 'user' && (
                <div className="font-semibold text-xs mb-1">
                  {message.sender} ({aiAgents.find(a => a.name === message.sender)?.role})
                </div>
              )}
              <div className="text-sm prose prose-pink dark:prose-invert max-w-none text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-end space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === ''}
            className={`px-4 py-2 rounded-lg ${
              inputMessage.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            Kirim
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
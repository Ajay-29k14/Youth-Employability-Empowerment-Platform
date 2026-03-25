/**
 * Chatbot Component
 * Simple rule-based chatbot for career guidance
 */
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I am your Career Guide. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple rule-based responses
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Job-related queries
    if (lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('employment')) {
      return 'You can find job opportunities in the Jobs section. We list local jobs based on your location and skills. Would you like me to guide you there?';
    }
    
    // Scheme-related queries
    if (lowerMessage.includes('scheme') || lowerMessage.includes('government') || lowerMessage.includes('program')) {
      return 'We have information about various government schemes for youth. Check out the Government Schemes section to find programs you may be eligible for.';
    }
    
    // Skill-related queries
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('training')) {
      return 'Developing skills is important for your career. Visit our Career Resources section for interview tips, resume guidance, and skill-building resources.';
    }
    
    // Resume-related queries
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv') || lowerMessage.includes('biodata')) {
      return 'A good resume is key to getting hired. Keep it simple, highlight your skills, and include your contact information. Check our Resources section for resume templates!';
    }
    
    // Interview-related queries
    if (lowerMessage.includes('interview') || lowerMessage.includes('preparation')) {
      return 'For interview preparation: 1) Research the company 2) Practice common questions 3) Dress appropriately 4) Be confident and honest. Check our Resources for more tips!';
    }
    
    // Profile-related queries
    if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      return 'You can update your profile in the Profile section. Make sure to add your skills, education, and career interests for better job recommendations!';
    }
    
    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return 'Namaste! How can I assist you with your career today?';
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('dhanyavad')) {
      return 'You\'re welcome! Feel free to ask if you need any more help. Good luck with your career!';
    }
    
    // Default response
    return 'I\'m here to help with career guidance, job information, government schemes, and skill development. Could you please be more specific about what you\'re looking for?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: getBotResponse(input)
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Suggested questions
  const suggestions = [
    'How do I find jobs?',
    'Tell me about government schemes',
    'How to prepare for interviews?',
    'Resume tips'
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Career Guide</h3>
                <p className="text-xs text-emerald-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-emerald-700 p-1 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                    )}
                    <p className="text-sm">{message.text}</p>
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(suggestion);
                      }}
                      className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message, onQuickClick }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start space-x-3 my-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-xs shrink-0 ${
        isBot ? 'bg-[#6B1E2B]' : 'bg-[#A63D40]'
      }`}>
        {isBot ? <Bot className="w-4 h-4 text-[#D4A24C]" /> : <User className="w-4 h-4" />}
      </div>

      {/* Content Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
          isBot 
            ? 'bg-white text-[#2B2118] border border-[#D4A24C]/30 rounded-tl-none' 
            : 'bg-[#6B1E2B] text-white rounded-tr-none'
        }`}>
          {message.text}
        </div>

        {/* Quick Action Chips */}
        {isBot && message.quickButtons && message.quickButtons.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.quickButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (btn.action) btn.action();
                  else if (btn.query) onQuickClick(btn.query);
                }}
                className="bg-[#FFF8F0] hover:bg-[#6B1E2B] hover:text-white text-[#6B1E2B] border border-[#6B1E2B]/40 text-xs font-medium px-3 py-1.5 rounded-full transition-all shadow-2xs cursor-pointer"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] text-[#756B63] block px-1 ${isBot ? '' : 'text-right'}`}>
          {message.timestamp}
        </span>
      </div>

    </div>
  );
}
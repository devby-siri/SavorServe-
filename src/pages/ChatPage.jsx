import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, RotateCcw } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import { processUserMessage } from '../services/chatbotEngine';

export default function ChatPage({ menu, cart, onAddToCart, onRemoveItem, onClearCart, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "bot",
      text: "👋 Welcome to SavorServe!\nI'm your restaurant ordering assistant.\n\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickButtons: [
        { label: "View Menu", query: "Show me the menu" },
        { label: "Today's Offers", query: "Any offers?" },
        { label: "My Cart", query: "Show my cart" }
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Process Bot Response
    setTimeout(() => {
      const botResult = processUserMessage(text, cart, menu, onNavigate);

      // Execute Cart Side Effects
      if (botResult.actionType === "ADD_ITEMS" && botResult.itemsToAdd) {
        botResult.itemsToAdd.forEach(entry => {
          for (let i = 0; i < entry.quantity; i++) {
            onAddToCart(entry.item);
          }
        });
      } else if (botResult.actionType === "CLEAR_CART") {
        onClearCart();
      } else if (botResult.actionType === "REMOVE_ITEM" && botResult.item) {
        onRemoveItem(botResult.item.id);
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickButtons: botResult.quickButtons
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-[#D4A24C]/40 shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#6B1E2B] text-white p-4 flex items-center justify-between border-b border-[#D4A24C]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF8F0] text-[#6B1E2B] flex items-center justify-center font-bold text-lg shadow-sm">
            🍽️
          </div>
          <div>
            <h2 className="font-bold text-base font-serif">SavorServe Assistant</h2>
            <p className="text-[11px] text-[#D4A24C] font-sans">Natural Language Food Ordering AI</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-[#521620] transition-colors text-xs flex items-center space-x-1"
          title="Reset Chat"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-[#FFF8F0]">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onQuickClick={(q) => handleSend(q)} />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-[#756B63] text-xs py-2 px-4 bg-white/80 rounded-full w-max border border-[#D4A24C]/30 animate-pulse">
            <Bot className="w-4 h-4 text-[#6B1E2B]" />
            <span>SavorServe Assistant is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-[#D4A24C]/30 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type e.g., 'I want 2 cheese burgers and 1 coke'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#FFF8F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#2B2118] focus:outline-none focus:border-[#6B1E2B]"
        />
        <button
          type="submit"
          className="bg-[#6B1E2B] hover:bg-[#521620] text-white p-3 rounded-xl transition-all shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

    </div>
  );
}
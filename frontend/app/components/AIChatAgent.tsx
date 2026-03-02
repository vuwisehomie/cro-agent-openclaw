'use client';

import React, { useState } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export default function AIChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: "Hello Vu! I'm Sky, your AI CRO Strategist. How can I help you optimize your store today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'agent', content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-slate-900 italic">Sky — AI Marketing Agent</h2>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span className="text-[10px] font-bold uppercase">{msg.role}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask Sky anything about your conversion data..." 
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

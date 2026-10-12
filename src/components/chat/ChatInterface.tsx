'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { INITIAL_CHAT_MESSAGES } from '@/data/mockData';
import { sendChatMessage } from '@/services/api';
import { StructuredDiagnosisMessage } from './StructuredDiagnosisMessage';
import { ChatInput } from './ChatInput';
import {
  Sprout,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { usePlantContext } from '@/context/PlantContext';

export function ChatInterface({ initialQuery }: { initialQuery?: string }) {
  const { selectedPlant } = usePlantContext();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // If query passed in URL params, automatically handle query
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (text: string, imageAttachment?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageAttachment
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text, imageAttachment, selectedPlant?.id);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-emerald-950/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 bg-white/90 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-2">
              🌿 Plant Doctor AI
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Online
              </span>
            </h2>
            <p className="text-[11px] text-neutral-500">
              Your personal agronomic and plant health assistant
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Vision Active</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FBFDFB]">
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-2xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-neutral-800 text-white'
                    : 'bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`space-y-2 text-xs sm:text-sm ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Image Attachment */}
                {message.imageAttachment && (
                  <div className="max-w-xs rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-900 mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.imageAttachment}
                      alt="Uploaded plant specimen"
                      className="w-full h-auto max-h-48 object-cover"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-3xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {message.text}
                </div>

                {/* Structured Diagnosis Card */}
                {message.diagnosisCard && (
                  <StructuredDiagnosisMessage card={message.diagnosisCard} />
                )}

                {/* Quick Action Prompt Chips */}
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {message.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleActionClick(action)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 transition-all flex items-center gap-1.5 active:scale-95 text-left"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-neutral-400 block px-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-md items-center text-xs text-neutral-500">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-neutral-200 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-neutral-500 text-xs ml-1 font-medium">Plant Doctor is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-neutral-100 space-y-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isTyping} />
        <DisclaimerBanner variant="compact" />
      </div>
    </div>
  );
}

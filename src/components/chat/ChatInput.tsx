'use client';

import React, { useState, useRef } from 'react';
import {
  Send,
  Camera,
  Image as ImageIcon,
  Paperclip,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CameraCapture } from '@/components/scanner/CameraCapture';

interface ChatInputProps {
  onSendMessage: (text: string, imageAttachment?: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() && !attachedImage) return;
    if (isLoading) return;

    onSendMessage(message.trim(), attachedImage || undefined);
    setMessage('');
    setAttachedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Clipboard paste support for images
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setAttachedImage(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachedImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-white rounded-3xl border transition-all ${
        isDraggingOver
          ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/40'
          : 'border-emerald-950/15 shadow-sm'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Attached Image Preview Pill */}
      {attachedImage && (
        <div className="p-3 pb-0 flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachedImage}
              alt="Attached specimen"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              title="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="text-xs space-y-0.5">
            <span className="font-semibold text-emerald-950 block">
              Leaf Specimen Attached
            </span>
            <span className="text-[11px] text-neutral-500 block">
              Ready for visual disease classification.
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-emerald-700 hover:underline font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Replace photo
            </button>
          </div>
        </div>
      )}

      {/* Textarea Input Form */}
      <form onSubmit={handleSubmit} className="p-2 sm:p-3 flex flex-col gap-2">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Ask Plant Doctor AI (e.g. My leaves have brown spots, paste or attach photo)..."
          className="w-full px-3 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none resize-none bg-transparent"
        />

        {/* Toolbar & Send Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
          <div className="flex items-center gap-1">
            {/* Choose file attachment */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Upload plant photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Camera Capture */}
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className="p-2 rounded-xl text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Capture photo with camera"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Sample leaf loader */}
            <button
              type="button"
              onClick={() => setAttachedImage('/images/plants/tomato-blight.jpg')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Attach sample diseased tomato leaf"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Attach Demo Leaf</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400 hidden sm:inline">
              Enter to send, Shift+Enter for newline
            </span>

            <button
              type="submit"
              disabled={(!message.trim() && !attachedImage) || isLoading}
              className="p-2 sm:px-4 sm:py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-900/20"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Camera Capture Modal */}
      {isCameraActive && (
        <CameraCapture
          onCapture={(img) => {
            setAttachedImage(img);
            setIsCameraActive(false);
          }}
          onClose={() => setIsCameraActive(false)}
        />
      )}
    </div>
  );
}

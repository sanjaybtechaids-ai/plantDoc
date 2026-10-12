'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, ImagePlus, AlertCircle, FileCheck, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string, fileInfo?: { name: string; size: number }) => void;
  onOpenCamera: () => void;
  onUseSampleImage: () => void;
}

export function ImageUploader({
  onImageSelected,
  onOpenCamera,
  onUseSampleImage
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    // Format validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    // Size validation: 10MB max
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds 10MB. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, { name: file.name, size: file.size });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 group flex flex-col items-center justify-center ${
          isDragging
            ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01] shadow-xl shadow-emerald-900/10'
            : 'border-emerald-950/20 bg-white/70 hover:bg-emerald-50/40 hover:border-emerald-600/50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Icon with animated pulse */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 ${
            isDragging
              ? 'bg-emerald-600 text-white animate-bounce'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isDragging ? (
            <FileCheck className="w-8 h-8" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-emerald-950 tracking-tight">
          {isDragging ? 'Drop image to analyze now' : 'Drag & drop your plant image here'}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm leading-relaxed">
          or <span className="font-semibold text-emerald-700 underline underline-offset-2">click to browse</span> from your device
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400">
          <span className="px-2.5 py-1 rounded-md bg-neutral-100 font-medium text-neutral-600">
            JPG, PNG, WEBP
          </span>
          <span>•</span>
          <span>Max 10 MB</span>
          <span>•</span>
          <span>Macro or Close-up leaf shots recommended</span>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Alternative Input Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Camera button */}
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-emerald-950/15 hover:border-emerald-600 hover:bg-emerald-50/50 text-emerald-950 text-xs font-semibold shadow-xs transition-all active:scale-98"
        >
          <Camera className="w-4 h-4 text-emerald-700" />
          <span>Take a Photo</span>
        </button>

        {/* File selector button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-emerald-950/15 hover:border-emerald-600 hover:bg-emerald-50/50 text-emerald-950 text-xs font-semibold shadow-xs transition-all active:scale-98"
        >
          <ImagePlus className="w-4 h-4 text-emerald-700" />
          <span>Choose Image</span>
        </button>

        {/* Use Sample Diseased Plant */}
        <button
          type="button"
          onClick={onUseSampleImage}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300/80 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold shadow-xs transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Load Demo Tomato Leaf</span>
        </button>
      </div>
    </div>
  );
}

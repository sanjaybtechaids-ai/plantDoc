'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      setIsInitializing(true);
      setCameraError(null);

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported by your browser.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn('Camera initialization error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. Please allow camera permissions in your browser or use file upload.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera hardware was detected on this device.');
        } else {
          setCameraError(err.message || 'Unable to access camera.');
        }
      } finally {
        setIsInitializing(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Capture photo from video stream
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      onCapture(capturedImage);
    }
  };

  const handleSwitchCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Fallback demo sample photo if device has no physical webcam
  const handleUseDemoLeaf = () => {
    onCapture('/images/plants/tomato-blight.jpg');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/90 text-white z-10">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm">Plant Health Camera</h3>
          </div>
          <button
            onClick={() => {
              if (stream) stream.getTracks().forEach(t => t.stop());
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-semibold text-sm">Camera Unavailable</h4>
                <p className="text-neutral-400 text-xs leading-relaxed">{cameraError}</p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleUseDemoLeaf}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Use Sample Diseased Leaf Photo
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                >
                  Switch to File Upload
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured leaf preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 backdrop-blur-sm">
                Photo Captured
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder target reticle */}
              <div className="absolute inset-8 border-2 border-emerald-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-medium text-emerald-300/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                    Align affected leaf in frame
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center text-white text-xs gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Connecting to camera hardware...</span>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        {!cameraError && (
          <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-4">
            {capturedImage ? (
              <>
                <button
                  onClick={handleRetake}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Photo
                </button>
                <button
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Check className="w-4 h-4" />
                  Use This Photo
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSwitchCamera}
                  className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  title="Switch camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTakeSnapshot}
                  disabled={isInitializing}
                  className="w-16 h-16 rounded-full bg-white hover:bg-neutral-200 active:scale-95 ring-4 ring-emerald-500/40 flex items-center justify-center transition-all disabled:opacity-50"
                  title="Take photo"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-neutral-900 bg-white" />
                </button>

                <button
                  onClick={handleUseDemoLeaf}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium"
                >
                  Sample Leaf
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { CameraCapture } from './CameraCapture';
import { ImagePreview } from './ImagePreview';
import { AIScanningModal } from './AIScanningModal';
import { VisualAnalysisResult } from './VisualAnalysisResult';
import { Diagnosis } from '@/types';
import { PlantMetadataInput } from '@/types/plant';
import { usePlantContext } from '@/context/PlantContext';
import { Scan, Sparkles, AlertCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';

export type ScannerUIState = 'idle' | 'uploading' | 'analyzing' | 'success' | 'uncertain' | 'error';

export function PlantScanner() {
  const { scanPlant, latestDiagnosis, setLatestDiagnosis } = usePlantContext();

  const [uiState, setUiState] = useState<ScannerUIState>(
    latestDiagnosis ? 'success' : 'idle'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    latestDiagnosis ? latestDiagnosis.imageUrl : null
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis | null>(latestDiagnosis);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle image selected from upload
  const handleImageSelected = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
    setUiState('idle'); // image preview ready
  };

  // Handle camera photo capture
  const handleCameraCapture = (imageDataUrl: string) => {
    setIsCameraOpen(false);
    setSelectedImage(imageDataUrl);
    setUiState('idle');
  };

  // Handle demo leaf load
  const handleUseSampleImage = () => {
    setSelectedImage('/images/plants/tomato-blight.jpg');
    setUiState('idle');
  };

  // Run AI analysis
  const handleAnalyze = async (metadata: PlantMetadataInput) => {
    if (!selectedImage) return;

    setUiState('analyzing');
    setAnalysisStep(0);
    setErrorMessage(null);

    try {
      const result = await scanPlant(selectedImage, metadata, (stepIdx) => {
        setAnalysisStep(stepIdx);
      });

      setCurrentDiagnosis(result);
      setLatestDiagnosis(result);

      // Check if result is uncertain
      if (
        result.identificationConfidence < 40 ||
        result.disease.confidence < 45 ||
        result.disease.name.toLowerCase().includes('uncertain')
      ) {
        setUiState('uncertain');
      } else {
        setUiState('success');
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      setErrorMessage(
        error?.message ||
        'Plant Doctor AI is temporarily unavailable. Please check your connection and try again.'
      );
      setUiState('error');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCurrentDiagnosis(null);
    setErrorMessage(null);
    setUiState('idle');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      {uiState !== 'success' && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Scan className="w-4 h-4 text-emerald-600" />
            <span>AI Optical Agronomist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            Scan Your Plant
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Upload or capture a clear close-up image of the affected leaf or stems for instant disease recognition and treatment.
          </p>
        </div>
      )}

      {/* State 1: Dropzone when no image is loaded */}
      {uiState === 'idle' && !selectedImage && (
        <ImageUploader
          onImageSelected={handleImageSelected}
          onOpenCamera={() => setIsCameraOpen(true)}
          onUseSampleImage={handleUseSampleImage}
        />
      )}

      {/* State 2: Image Preview & Details Form */}
      {uiState === 'idle' && selectedImage && (
        <ImagePreview
          imageUrl={selectedImage}
          onAnalyze={handleAnalyze}
          onReplace={() => setSelectedImage(null)}
          onRemove={handleReset}
        />
      )}

      {/* State 3: AI Scanning Progress Modal */}
      {uiState === 'analyzing' && (
        <AIScanningModal
          currentStepIndex={analysisStep}
          imageUrl={selectedImage || undefined}
        />
      )}

      {/* State 4: Uncertain Result Banner & Option to view anyway */}
      {uiState === 'uncertain' && currentDiagnosis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-950 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Unable to Confidently Identify Condition</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              Unable to confidently identify the condition from this image alone. Try uploading a clearer, higher-resolution photo in natural daylight showing both the entire plant and close-up affected leaves.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Clearer Photo</span>
              </button>
              <button
                onClick={() => setUiState('success')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-all"
              >
                View Preliminary Analysis Anyway
              </button>
            </div>
          </div>

          <VisualAnalysisResult
            diagnosis={currentDiagnosis}
            onResetScan={handleReset}
          />
        </div>
      )}

      {/* State 5: Error State */}
      {uiState === 'error' && (
        <div className="p-8 max-w-lg mx-auto bg-white rounded-3xl border border-red-200 shadow-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Analysis Error</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              {errorMessage || 'Plant Doctor AI is temporarily unavailable. Please try again.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setUiState('idle')}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Preview</span>
            </button>
            <button
              onClick={() => handleAnalyze({})}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Scan</span>
            </button>
          </div>
        </div>
      )}

      {/* State 6: Success Diagnosis Results */}
      {uiState === 'success' && currentDiagnosis && (
        <VisualAnalysisResult
          diagnosis={currentDiagnosis}
          onResetScan={handleReset}
        />
      )}

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
}

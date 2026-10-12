export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageAttachment?: string;
  diagnosisCard?: {
    diseaseName: string;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe';
    symptoms: string[];
    immediateActions: string[];
    naturalTreatment: string;
    chemicalTreatment: string;
    nextCheck: string;
  };
  suggestedActions?: string[];
}

export interface Conversation {
  id: string;
  userId: string;
  plantId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

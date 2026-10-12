import { NextRequest } from 'next/server';
import { chatWithPlantDoctor } from '@/lib/ai/gemini';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { ChatRequestSchema, errorResponse, successResponse } from '@/lib/validation/api';
import { ChatMessage } from '@/types';
import { INITIAL_PLANTS } from '@/data/mockData';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ChatRequestSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse('VALIDATION_ERROR', 'Message cannot be empty.', 400, validated.error.format());
    }

    const { message, plantId, conversationId, image } = validated.data;
    const authUser = await getAuthenticatedUser();
    const supabase = getAdminSupabase();

    // 1. Fetch relevant plant context if plantId is provided
    let plantContext: any = undefined;
    if (plantId) {
      if (supabase && authUser) {
        try {
          const { data: plantRecord } = await supabase
            .from('plants')
            .select('*')
            .eq('id', plantId)
            .single();
          if (plantRecord) {
            plantContext = {
              plantName: plantRecord.name,
              species: plantRecord.species,
              currentIssue: plantRecord.notes
            };
          }
        } catch (err) {
          console.warn('Could not load plant context from Supabase:', err);
        }
      }
      if (!plantContext) {
        const found = INITIAL_PLANTS.find((p) => p.id === plantId);
        if (found) {
          plantContext = {
            plantName: found.name,
            species: found.species,
            healthScore: found.healthScore,
            currentIssue: found.currentIssue
          };
        }
      }
    }

    // 2. Query Gemini AI with multimodal content and context
    const aiResponse = await chatWithPlantDoctor(message, {
      imagePart: image,
      context: plantContext
    });

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: aiResponse.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosisCard: aiResponse.diagnosisCard,
      suggestedActions: aiResponse.suggestedActions
    };

    // 3. Save conversation and messages to Supabase if authenticated
    if (supabase && authUser) {
      try {
        let activeConvId = conversationId;
        if (!activeConvId) {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              user_id: authUser.id,
              plant_id: plantId && !plantId.startsWith('plant-') ? plantId : null,
              title: message.slice(0, 50)
            })
            .select()
            .single();
          if (newConv) activeConvId = newConv.id;
        }

        if (activeConvId) {
          // Save user message
          await supabase.from('messages').insert({
            conversation_id: activeConvId,
            role: 'user',
            content: message,
            image_url: image ? 'attached_image' : null
          });

          // Save assistant message
          await supabase.from('messages').insert({
            conversation_id: activeConvId,
            role: 'assistant',
            content: assistantMsg.text,
            diagnosis_card: assistantMsg.diagnosisCard,
            suggested_actions: assistantMsg.suggestedActions
          });
        }
      } catch (chatDbErr) {
        console.warn('Could not save chat messages to Supabase:', chatDbErr);
      }
    }

    return successResponse(assistantMsg);
  } catch (error) {
    console.error('[API Error] /api/chat failed:', error);
    return errorResponse(
      'AI_CHAT_FAILED',
      'Plant Doctor AI is temporarily unavailable. Please try again.',
      500
    );
  }
}

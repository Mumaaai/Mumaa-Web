// src/utils/puterAiService.ts

export interface PuterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const callPuterAI = async (
  messages: PuterMessage[],
  model: string = 'gpt-4o-mini'
): Promise<string | null> => {
  if (typeof window === 'undefined' || !window.puter) {
    console.warn("Puter AI is not available on the window object.");
    return null;
  }

  try {
    const response = await window.puter.ai.chat(messages, { model });
    return response?.message?.content || null;
  } catch (error) {
    console.error("Failed to generate response from Puter AI:", error);
    return null;
  }
};
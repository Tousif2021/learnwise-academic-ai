
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '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',
  dangerouslyAllowBrowser: true
});

export async function summarizeDocument(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: `Summarize the following document:\n${text}` }],
  });
  return response.choices[0].message.content;
}

export async function generateFlashcards(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Generate 5 flashcards (question and answer pairs) from the following content in JSON array format, where each item has "question" and "answer" fields:\n${text}`
    }],
  });
  // Try to parse as JSON, fallback to plain text if parsing fails
  try {
    return JSON.parse(response.choices[0].message.content as string);
  } catch {
    return [];
  }
}

export async function generateMCQs(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Generate 3 multiple choice questions from the following content in JSON array format, each item should have "question", "options" (array), "correctOption" (index), and "explanation":\n${text}`
    }],
  });
  try {
    return JSON.parse(response.choices[0].message.content as string);
  } catch {
    return [];
  }
}

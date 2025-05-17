export type ToolType = "summary" | "flashcards" | "mcqs" | "concepts" | "explain";

export interface ToolOption {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ElementType;
}
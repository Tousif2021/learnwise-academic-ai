
import { ReactElement } from "react";

export type ToolType = "summary" | "flashcards" | "mcqs" | "concepts";

export interface ToolOption {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ElementType;
}

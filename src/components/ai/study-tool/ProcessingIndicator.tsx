
import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  selectedTool: string | null;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ selectedTool }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 size={40} className="animate-spin text-edu-primary mb-4" />
      <h3 className="text-lg font-medium mb-2">Processing Your Document</h3>
      <p className="text-sm text-muted-foreground">
        {selectedTool === "summary" && "Generating a comprehensive summary..."}
        {selectedTool === "flashcards" && "Creating study flashcards..."}
        {selectedTool === "mcqs" && "Building quiz questions..."}
        {selectedTool === "concepts" && "Extracting key concepts..."}
      </p>
    </div>
  );
};

export default ProcessingIndicator;

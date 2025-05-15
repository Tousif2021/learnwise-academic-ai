
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import SummaryContent from "../document-processor/SummaryContent";
import FlashcardsContent from "../document-processor/FlashcardsContent";
import MCQsContent from "../document-processor/MCQsContent";
import ConceptsContent from "../document-processor/ConceptsContent";
import { AIContent } from "@/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface ResultViewProps {
  file: File | null;
  aiContent: AIContent | null;
  selectedTool: string | null;
  resetAll: () => void;
  resetTool: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  file, 
  aiContent, 
  selectedTool, 
  resetAll, 
  resetTool 
}) => {
  if (!aiContent || !selectedTool || !file) return null;

  return (
    <div>
      <div className="mb-4 bg-muted/50 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center">
          <FileText size={18} className="mr-2 text-edu-primary" />
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">Processed {new Date().toLocaleString()}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetTool}>
          Choose Another Tool
        </Button>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <Tabs value={selectedTool} defaultValue={selectedTool}>
          {selectedTool === "summary" && (
            <TabsContent value="summary">
              <SummaryContent summary={aiContent.summary || ""} />
            </TabsContent>
          )}
          {selectedTool === "flashcards" && (
            <TabsContent value="flashcards">
              <FlashcardsContent flashcards={aiContent.flashcards || []} />
            </TabsContent>
          )}
          {selectedTool === "mcqs" && (
            <TabsContent value="mcqs">
              <MCQsContent mcqs={aiContent.mcqs || []} />
            </TabsContent>
          )}
          {selectedTool === "concepts" && (
            <TabsContent value="concepts">
              <ConceptsContent concepts={aiContent.keyConcepts || []} />
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <Button 
        variant="outline" 
        className="mt-4 w-full" 
        onClick={resetAll}
      >
        Process Another Document
      </Button>
    </div>
  );
};

export default ResultView;


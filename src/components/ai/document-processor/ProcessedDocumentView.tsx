
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, FileQuestion, Key } from "lucide-react";
import SummaryContent from "./SummaryContent";
import FlashcardsContent from "./FlashcardsContent";
import MCQsContent from "./MCQsContent";
import ConceptsContent from "./ConceptsContent";
import { AIContent } from "@/types";

interface ProcessedDocumentViewProps {
  file: File;
  aiContent: AIContent;
  activeTab: string;
  onTabChange: (value: string) => void;
  onNewUpload: () => void;
}

const ProcessedDocumentView: React.FC<ProcessedDocumentViewProps> = ({
  file,
  aiContent,
  activeTab,
  onTabChange,
  onNewUpload,
}) => {
  return (
    <div>
      <div className="mb-4 bg-muted/50 rounded-lg p-3 flex items-center">
        <FileText size={18} className="mr-2 text-edu-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">Generated {new Date().toLocaleString()}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewUpload}
        >
          New Upload
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="summary" className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-1">
            <FileQuestion size={14} />
            <span>Flashcards</span>
          </TabsTrigger>
          <TabsTrigger value="mcqs" className="flex items-center gap-1">
            <FileQuestion size={14} />
            <span>MCQs</span>
          </TabsTrigger>
          <TabsTrigger value="concepts" className="flex items-center gap-1">
            <Key size={14} />
            <span>Key Concepts</span>
          </TabsTrigger>
        </TabsList>
        
        <SummaryContent summary={aiContent.summary || ""} />
        <FlashcardsContent flashcards={aiContent.flashcards || []} />
        <MCQsContent mcqs={aiContent.mcqs || []} />
        <ConceptsContent concepts={aiContent.keyConcepts || []} />
      </Tabs>
    </div>
  );
};

export default ProcessedDocumentView;

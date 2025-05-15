
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAIContent } from "@/services/mockData";
import { AIContent } from "@/types";
import { 
  BookOpen, 
  FileQuestion, 
  Key, 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileUploadArea, 
  ToolSelection, 
  ProcessingIndicator, 
  ResultView,
  ToolType,
  ToolOption
} from "./study-tool";

const AIStudyTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const { toast } = useToast();

  const tools: ToolOption[] = [
    {
      id: "summary",
      name: "Summarizer",
      description: "Generate a concise summary of your document",
      icon: BookOpen
    },
    {
      id: "flashcards",
      name: "Flashcard Generator",
      description: "Create study flashcards from your document",
      icon: FileQuestion
    },
    {
      id: "mcqs",
      name: "Quiz Creator",
      description: "Generate quiz questions based on the document",
      icon: FileQuestion
    },
    {
      id: "concepts",
      name: "Key Concepts",
      description: "Extract important concepts and definitions",
      icon: Key
    }
  ];

  const resetContent = () => {
    setAiContent(null);
    setSelectedTool(null);
  };

  const resetAll = () => {
    setFile(null);
    setAiContent(null);
    setSelectedTool(null);
  };

  const processTool = async (toolType: ToolType) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setSelectedTool(toolType);
    
    try {
      // In a real application, we would upload the file to a server and process it
      // Here we're just using mock data based on the filename
      const content = await generateAIContent(file.name);
      setAiContent(content);
      
      toast({
        title: "Processing complete",
        description: `Your file has been processed using the ${toolType} tool.`,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your document.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    if (isProcessing) {
      return <ProcessingIndicator selectedTool={selectedTool} />;
    }

    if (!file) {
      return <FileUploadArea setFile={setFile} resetContent={resetContent} />;
    }

    if (!selectedTool || !aiContent) {
      return (
        <ToolSelection 
          file={file} 
          tools={tools} 
          isProcessing={isProcessing} 
          onSelectTool={(toolId) => processTool(toolId as ToolType)} 
          resetAll={resetAll} 
        />
      );
    }

    return (
      <ResultView 
        file={file} 
        aiContent={aiContent} 
        selectedTool={selectedTool} 
        resetAll={resetAll} 
        resetTool={() => setSelectedTool(null)} 
      />
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="ai-gradient-text">AI Study Tool</CardTitle>
        <CardDescription>
          Upload documents to generate summaries, flashcards, quizzes, and extract key concepts
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default AIStudyTool;

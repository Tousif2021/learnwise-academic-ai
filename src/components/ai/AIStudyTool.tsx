
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateAIContent } from "@/services/mockData";
import { AIContent } from "@/types";
import { 
  FileText, 
  BookOpen, 
  FileQuestion, 
  Key, 
  Upload,
  Loader2
} from "lucide-react";
import SummaryContent from "./document-processor/SummaryContent";
import FlashcardsContent from "./document-processor/FlashcardsContent";
import MCQsContent from "./document-processor/MCQsContent";
import ConceptsContent from "./document-processor/ConceptsContent";
import { useToast } from "@/hooks/use-toast";

type ToolType = "summary" | "flashcards" | "mcqs" | "concepts";

interface ToolOption {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ElementType;
}

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Reset any previous results
      setAiContent(null);
      setSelectedTool(null);
      
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      // Reset any previous results
      setAiContent(null);
      setSelectedTool(null);
      
      toast({
        title: "File uploaded",
        description: `${droppedFile.name} has been uploaded successfully.`,
      });
    }
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

  const resetAll = () => {
    setFile(null);
    setAiContent(null);
    setSelectedTool(null);
  };

  const renderFileUpload = () => (
    <div 
      className="border-2 border-dashed border-muted rounded-lg p-8 text-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Upload size={24} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Upload a Document</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload PDF, DOCX, or TXT files to process with our AI study tools
      </p>
      
      <label htmlFor="ai-file-upload" className="cursor-pointer">
        <input
          id="ai-file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button className="cursor-pointer bg-edu-primary hover:bg-edu-primary/90">
          Select File
        </Button>
      </label>
    </div>
  );

  const renderToolSelection = () => (
    <div>
      <div className="mb-4 bg-muted/50 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center">
          <FileText size={18} className="mr-2 text-edu-primary" />
          <div>
            <p className="text-sm font-medium">{file?.name}</p>
            <p className="text-xs text-muted-foreground">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type || "Unknown type"}` : ""}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetAll}>
          Change File
        </Button>
      </div>

      <h3 className="text-lg font-medium mb-4">Select a Tool</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant="outline"
            className="h-auto p-4 justify-start gap-3"
            disabled={isProcessing}
            onClick={() => processTool(tool.id)}
          >
            <tool.icon className="h-5 w-5 text-edu-primary" />
            <div className="text-left">
              <div className="font-medium">{tool.name}</div>
              <div className="text-xs text-muted-foreground">{tool.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!aiContent || !selectedTool) return null;

    return (
      <div>
        <div className="mb-4 bg-muted/50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <FileText size={18} className="mr-2 text-edu-primary" />
            <div>
              <p className="text-sm font-medium">{file?.name}</p>
              <p className="text-xs text-muted-foreground">Processed {new Date().toLocaleString()}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedTool(null)}>
            Choose Another Tool
          </Button>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          {selectedTool === "summary" && <SummaryContent summary={aiContent.summary || ""} />}
          {selectedTool === "flashcards" && <FlashcardsContent flashcards={aiContent.flashcards || []} />}
          {selectedTool === "mcqs" && <MCQsContent mcqs={aiContent.mcqs || []} />}
          {selectedTool === "concepts" && <ConceptsContent concepts={aiContent.keyConcepts || []} />}
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

  const renderContent = () => {
    if (isProcessing) {
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
    }

    if (!file) {
      return renderFileUpload();
    }

    if (!selectedTool || !aiContent) {
      return renderToolSelection();
    }

    return renderResult();
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

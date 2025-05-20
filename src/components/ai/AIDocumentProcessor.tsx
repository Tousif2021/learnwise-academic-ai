
import React, { useState } from "react";
import { summarizeDocument, generateFlashcards, generateMCQs } from "./OpenAI";
import { Card, CardContent } from "@/components/ui/card";
import { AIContent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import FilePreview from "./document-processor/FilePreview";
import ProcessedDocumentView from "./document-processor/ProcessedDocumentView";
import UploadSection from "./document-processor/UploadSection";

const AIDocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();
  
  const extractFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          resolve(e.target?.result as string);
        } else {
          // For non-text files, we'll use a simulation for demo purposes
          const fileName = file.name.toLowerCase();
          let content = "";
          
          if (fileName.includes("machine") || fileName.includes("ai")) {
            content = "This document discusses various machine learning algorithms and their applications in modern AI systems. It covers supervised and unsupervised learning techniques, neural networks, and real-world case studies.";
          } else if (fileName.includes("physics")) {
            content = "The document explains fundamental physics concepts including Newton's laws of motion, thermodynamics, and quantum mechanics. It includes mathematical formulas and experimental results.";
          } else if (fileName.includes("history")) {
            content = "This historical text analyzes major events of the 20th century including both World Wars, the Cold War period, and their sociopolitical impacts on modern society.";
          } else {
            content = "This academic document appears to contain educational content with several sections covering theoretical concepts, methodologies, and practical applications. It includes references and illustrations.";
          }
          
          resolve(content);
        }
      };
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        setTimeout(() => {
          reader.onload({ target: { result: "" } } as any);
        }, 500);
      }
    });
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const startTime = Date.now();
      const fileContent = await extractFileContent(file);

      // Use OpenAI for summary
      const summary = await summarizeDocument(fileContent);

      // Get AI-generated flashcards and MCQs
      const flashcards = await generateFlashcards(fileContent);
      const mcqs = await generateMCQs(fileContent);
      
      // Generate key concepts from summary
      const keyConcepts = generateKeyConcepts(summary, file.name);

      const newAiContent = {
        id: `ai-content-${Date.now()}`,
        courseContentId: `content-${Date.now()}`,
        summary,
        flashcards,
        mcqs,
        keyConcepts,
        generatedAt: new Date()
      };

      setAiContent(newAiContent);

      toast({
        title: "Processing complete",
        description: "Your document has been processed successfully.",
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

  // Helper function to extract key concepts
  const generateKeyConcepts = (summaryText: string, fileName: string) => {
    const lines = summaryText.split('.');
    return lines
      .filter(line => line.trim().length > 20)
      .slice(0, 5)
      .map(line => ({
        concept: line.trim(),
        details: `Detail for ${line.trim().substring(0, 30)}...`
      }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAiContent(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setAiContent(null);
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setAiContent(null);
    setActiveTab("summary");
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        {!file && (
          <UploadSection 
            onFileUpload={handleFileUpload}
            onDrop={handleDrop}
          />
        )}
        
        {file && !aiContent && (
          <FilePreview 
            file={file}
            isProcessing={isProcessing}
            onProcess={handleProcess}
          />
        )}
        
        {file && aiContent && (
          <ProcessedDocumentView
            file={file}
            aiContent={aiContent}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNewUpload={handleNewUpload}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AIDocumentProcessor;

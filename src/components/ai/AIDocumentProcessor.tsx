
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAIContent } from "@/services/mockData";
import { AIContent } from "@/types";
import { 
  UploadSection, 
  FilePreview, 
  ProcessedDocumentView 
} from "./document-processor";

const AIDocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // In a real application, we would upload the file to a server
      // Here we're just using the filename as a demo
      const content = await generateAIContent(file.name);
      setAiContent(content);
    } catch (error) {
      console.error("Error processing document:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAiContent(null);
  };

  const renderContent = () => {
    if (!file) {
      return <UploadSection onFileUpload={handleFileUpload} />;
    }
    
    if (!aiContent) {
      return (
        <FilePreview 
          file={file} 
          isProcessing={isProcessing} 
          onProcess={handleProcess} 
        />
      );
    }
    
    return (
      <ProcessedDocumentView
        file={file}
        aiContent={aiContent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewUpload={resetUpload}
      />
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="ai-gradient-text">AI Document Processor</CardTitle>
        <CardDescription>
          Upload lecture notes or study materials to generate summaries, flashcards, and more
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default AIDocumentProcessor;

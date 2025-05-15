
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIContent } from "@/types";
import { 
  UploadSection, 
  FilePreview, 
  ProcessedDocumentView 
} from "./document-processor";
import { useToast } from "@/hooks/use-toast";

const AIDocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAiContent(null);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been added.`,
      });
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // In a real application, you would upload the file to a server
      // For demo purposes, we'll simulate processing with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate synthetic AI content based on the file
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const newAiContent: AIContent = {
        id: `ai-content-${Date.now()}`,
        courseContentId: `content-${Date.now()}`,
        summary: `This is an AI-generated summary of "${file.name}". The document appears to be a ${fileExtension === 'pdf' ? 'PDF document' : fileExtension === 'docx' ? 'Word document' : 'text file'} about academic content. The main points include key concepts in the field, methodologies for research, and practical applications.`,
        flashcards: [
          { question: `What is the main topic of ${file.name}?`, answer: "The main topic appears to be academic content related to your course." },
          { question: "What methodology is discussed in this document?", answer: "The document discusses research methodologies applicable to this field." },
          { question: "What are the practical applications mentioned?", answer: "Several practical applications are mentioned, including real-world scenarios." }
        ],
        mcqs: [
          {
            question: "What is the primary focus of this document?",
            options: ["Academic research", "Entertainment", "News reporting", "Social media"],
            correctOption: 0,
            explanation: "The document primarily focuses on academic research related to your course."
          },
          {
            question: "Which of the following is NOT discussed in the document?",
            options: ["Research methodologies", "Practical applications", "Historical context", "Celebrity gossip"],
            correctOption: 3,
            explanation: "Celebrity gossip is not relevant to academic content and is not discussed."
          }
        ],
        keyConcepts: [
          { concept: "Academic Research", description: "The process of conducting structured investigation to increase knowledge." },
          { concept: "Methodology", description: "The system of methods and principles used in a particular discipline." },
          { concept: "Application", description: "The practical use of concepts in real-world scenarios." }
        ],
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

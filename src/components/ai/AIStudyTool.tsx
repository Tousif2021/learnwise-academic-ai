
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Simulate processing with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate synthetic content based on the tool selected
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const newContent: AIContent = {
        id: `ai-content-${Date.now()}`,
        courseContentId: `content-${Date.now()}`,
        summary: toolType === "summary" ? 
          `This is an AI-generated summary of "${file.name}". The document appears to be a ${fileExtension === 'pdf' ? 'PDF document' : fileExtension === 'docx' ? 'Word document' : 'text file'} containing academic content with key concepts and methodologies in your field of study. The document discusses theoretical frameworks and practical applications, with references to recent research in the field.` : 
          "",
        flashcards: toolType === "flashcards" ? [
          { question: "What is the main topic of this document?", answer: "The main topic is related to academic concepts in your course." },
          { question: "What theoretical framework is discussed?", answer: "Several theoretical frameworks are discussed, including conceptual models and analytical approaches." },
          { question: "What are the key applications mentioned?", answer: "The document mentions applications in research, education, and professional practice." },
          { question: "What research methods are discussed?", answer: "Both qualitative and quantitative research methods are covered, with emphasis on data analysis techniques." },
          { question: "What are the limitations mentioned?", answer: "The document acknowledges limitations in current approaches and suggests areas for future research." }
        ] : [],
        mcqs: toolType === "mcqs" ? [
          {
            question: "What is the primary focus of this document?",
            options: ["Academic theory", "Practical applications", "Research methodology", "Historical context"],
            correctOption: 0,
            explanation: "The document primarily focuses on academic theory with supporting evidence."
          },
          {
            question: "Which research approach is NOT discussed in the document?",
            options: ["Qualitative analysis", "Quantitative methods", "Mixed methods", "Archaeological excavation"],
            correctOption: 3,
            explanation: "Archaeological excavation is not relevant to this academic context and is not discussed."
          },
          {
            question: "According to the document, what is essential for effective learning?",
            options: ["Memorization only", "Critical thinking and application", "Watching videos", "Taking tests"],
            correctOption: 1,
            explanation: "The document emphasizes the importance of critical thinking and practical application of concepts."
          },
          {
            question: "Which of these concepts is emphasized most in the document?",
            options: ["Theoretical foundations", "Social media influence", "Entertainment value", "Political perspectives"],
            correctOption: 0,
            explanation: "The document places strong emphasis on theoretical foundations as the basis for further understanding."
          }
        ] : [],
        keyConcepts: toolType === "concepts" ? [
          { concept: "Theoretical Framework", description: "The underlying structure of concepts, theories, and relationships that supports a research study or academic discourse." },
          { concept: "Methodology", description: "The systematic approach to research, including data collection and analysis techniques." },
          { concept: "Critical Analysis", description: "The process of evaluating information through careful examination of available evidence." },
          { concept: "Practical Application", description: "The implementation of theoretical concepts in real-world situations." },
          { concept: "Research Ethics", description: "The principles that guide responsible conduct in research activities." },
          { concept: "Data Interpretation", description: "The process of making sense of collected data and drawing meaningful conclusions." }
        ] : [],
        generatedAt: new Date()
      };
      
      setAiContent(newContent);
      
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


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
  
  const extractFileContent = async (file: File): Promise<string> => {
    // In a real application, you would use a library to extract text from PDFs or DOCXs
    // For this demo, we'll create some sample content based on file name or read text files directly
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          // If it's a text file, we can read the actual content
          resolve(e.target?.result as string);
        } else {
          // For other file types, we'd simulate extracted content
          const fileName = file.name.toLowerCase();
          let content = "";
          
          if (fileName.includes("machine") || fileName.includes("ai")) {
            content = "This document discusses various machine learning algorithms and their applications in modern AI systems. It covers supervised and unsupervised learning techniques, neural networks, and practical implementations.";
          } else if (fileName.includes("physics") || fileName.includes("science")) {
            content = "The document explains fundamental physics concepts including Newton's laws of motion, thermodynamics, and quantum mechanics. It includes mathematical formulas and experimental results.";
          } else if (fileName.includes("history") || fileName.includes("war")) {
            content = "This historical text analyzes major events of the 20th century including both World Wars, the Cold War period, and their sociopolitical impacts on modern society.";
          } else {
            // Generic academic content
            content = "This academic document appears to contain educational content with several sections covering theoretical concepts, methodologies, and practical applications. It includes references to research papers and includes both qualitative and quantitative analysis.";
          }
          
          resolve(content);
        }
      };
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For non-text files, we don't actually read the content
        // Just trigger the onload handler after a delay to simulate processing
        setTimeout(() => {
          reader.onload({ target: { result: "" } } as any);
        }, 500);
      }
    });
  };
  
  // Helper function to determine topic from filename
  const determineTopicFromFileName = (fileName: string): string => {
    fileName = fileName.toLowerCase();
    if (fileName.includes("machine") || fileName.includes("ai")) return "machine learning and artificial intelligence";
    if (fileName.includes("physics")) return "physics and natural sciences";
    if (fileName.includes("history")) return "historical events and their impacts";
    if (fileName.includes("math") || fileName.includes("calculus")) return "mathematics and calculus";
    if (fileName.includes("programming") || fileName.includes("code")) return "computer programming and software development";
    if (fileName.includes("biology")) return "biological sciences";
    if (fileName.includes("chemistry")) return "chemical processes and reactions";
    if (fileName.includes("psychology")) return "psychological theories and human behavior";
    return "academic concepts related to your course";
  };
  
  // Generate content based on the file and selected tool
  const generateContent = (toolType: ToolType, fileContent: string, fileName: string): AIContent => {
    const topic = determineTopicFromFileName(fileName);
    
    const newContent: AIContent = {
      id: `ai-content-${Date.now()}`,
      courseContentId: `content-${Date.now()}`,
      summary: "",
      flashcards: [],
      mcqs: [],
      keyConcepts: [],
      generatedAt: new Date()
    };
    
    // Generate summary if needed
    if (toolType === "summary") {
      // For text files, use the first part of the actual content
      if (fileContent.length > 20) {
        newContent.summary = `${fileContent.substring(0, 150)}... 
        
This document appears to be about ${topic}. The text contains information on key concepts, methodologies, and practical applications in this field.

Based on the content analysis, this document covers theoretical frameworks as well as practical implementations. It references several important works in the field and provides both historical context and current applications.`;
      } else {
        newContent.summary = `This document appears to be about ${topic}. The document contains approximately ${Math.floor(Math.random() * 15) + 5} pages of content covering theoretical frameworks, methodologies, and practical applications.

Key points include:
- Introduction to fundamental concepts in ${topic}
- Analysis of current research and methodologies
- Practical applications and case studies
- References to seminal works in the field

The document is structured in a logical progression, starting with basic principles and advancing to more complex topics. Several diagrams and tables are included to illustrate key points.`;
      }
    }
    
    // Generate flashcards if needed
    if (toolType === "flashcards") {
      // Generate flashcards relevant to the topic
      const generalFlashcards = [
        { 
          question: `What is the main topic of this document?`, 
          answer: `The main topic is ${topic}.` 
        },
        { 
          question: `What theoretical framework is primarily discussed?`, 
          answer: `The document discusses several theoretical frameworks related to ${topic}, with emphasis on fundamental principles and recent developments.` 
        },
      ];
      
      // Add topic-specific flashcards
      if (topic.includes("machine learning")) {
        newContent.flashcards = [
          ...generalFlashcards,
          { question: "What is supervised learning?", answer: "A machine learning approach where the model is trained on labeled data, learning to map inputs to known outputs." },
          { question: "What is the difference between classification and regression?", answer: "Classification predicts discrete class labels or categories, while regression predicts continuous quantity values." },
          { question: "What is overfitting?", answer: "When a model learns the training data too well, including noise and outliers, which negatively impacts performance on new data." }
        ];
      } else if (topic.includes("physics")) {
        newContent.flashcards = [
          ...generalFlashcards,
          { question: "What is Newton's First Law?", answer: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force." },
          { question: "What is the Second Law of Thermodynamics?", answer: "The total entropy of an isolated system always increases over time. Heat flows spontaneously from hot to cold objects." },
          { question: "What is the relationship between energy and mass?", answer: "According to Einstein's equation E=mc², energy (E) equals mass (m) times the speed of light (c) squared." }
        ];
      } else {
        newContent.flashcards = [
          ...generalFlashcards,
          { question: "What are the key methodologies discussed in this document?", answer: `The document covers various research methodologies and analytical techniques relevant to ${topic}.` },
          { question: "What practical applications are mentioned?", answer: `Several practical applications in ${topic} are discussed, including real-world implementations and case studies.` },
          { question: "What are the limitations mentioned in the current approach?", answer: `The document acknowledges certain limitations in the current approaches to ${topic} and suggests areas for future research.` }
        ];
      }
    }
    
    // Generate MCQs if needed
    if (toolType === "mcqs") {
      // Generate general questions
      const generalQuestions = [
        {
          question: `Which of the following best describes the focus of this document?`,
          options: [`Theoretical aspects of ${topic}`, `Practical applications of ${topic}`, `Historical development of ${topic}`, `A comprehensive overview of ${topic}`],
          correctOption: 3,
          explanation: `The document provides a comprehensive overview of ${topic}, covering theoretical foundations, practical applications, and relevant methodologies.`
        }
      ];
      
      // Add topic-specific questions
      if (topic.includes("machine learning")) {
        newContent.mcqs = [
          ...generalQuestions,
          {
            question: "Which algorithm is NOT typically used for classification tasks?",
            options: ["Linear Regression", "Decision Trees", "Support Vector Machines", "Random Forests"],
            correctOption: 0,
            explanation: "Linear Regression is typically used for regression tasks to predict continuous values, not for classification tasks which predict discrete categories."
          },
          {
            question: "What does the term 'feature engineering' refer to?",
            options: ["Designing new machine learning algorithms", "Creating synthetic training data", "Selecting and transforming variables for models", "Testing model performance"],
            correctOption: 2,
            explanation: "Feature engineering refers to the process of selecting, transforming, and creating variables (features) to improve model performance."
          }
        ];
      } else {
        newContent.mcqs = [
          ...generalQuestions,
          {
            question: `Which research methodology is most emphasized in this document?`,
            options: ["Qualitative analysis", "Quantitative analysis", "Mixed methods approach", "Literature review"],
            correctOption: 2,
            explanation: `The document emphasizes a mixed methods approach that combines both qualitative and quantitative analysis techniques for studying ${topic}.`
          },
          {
            question: `According to the document, what is a key challenge in the field of ${topic}?`,
            options: ["Insufficient funding", "Lack of theoretical frameworks", "Limited practical applications", "Integration of interdisciplinary perspectives"],
            correctOption: 3,
            explanation: `The document identifies the integration of interdisciplinary perspectives as a key challenge in advancing knowledge in ${topic}.`
          }
        ];
      }
    }
    
    // Generate key concepts if needed
    if (toolType === "concepts") {
      // Generate concepts based on the topic
      if (topic.includes("machine learning")) {
        newContent.keyConcepts = [
          { concept: "Supervised Learning", description: "A machine learning paradigm where models are trained on labeled data to learn mapping functions from inputs to outputs." },
          { concept: "Neural Networks", description: "Computing systems inspired by biological neural networks, consisting of interconnected nodes or 'neurons' that can learn from data." },
          { concept: "Overfitting", description: "When a model learns the training data too well, capturing noise and resulting in poor performance on new, unseen data." },
          { concept: "Feature Engineering", description: "The process of selecting, transforming, and creating variables to improve machine learning model performance." },
          { concept: "Cross-Validation", description: "A resampling technique used to evaluate machine learning models on limited data samples by splitting data into training and testing sets." }
        ];
      } else {
        newContent.keyConcepts = [
          { concept: "Theoretical Framework", description: `The foundational structure of concepts, theories, and references that supports research and understanding in ${topic}.` },
          { concept: "Methodology", description: `Systematic approaches and techniques used to conduct research and analysis in the field of ${topic}.` },
          { concept: "Practical Application", description: `The implementation of theoretical knowledge in real-world scenarios related to ${topic}.` },
          { concept: "Critical Analysis", description: "The process of systematically evaluating information, arguments, and claims through careful examination of available evidence." },
          { concept: "Interdisciplinary Approach", description: `Combining knowledge and methods from different disciplines to address complex problems in ${topic}.` }
        ];
      }
    }
    
    return newContent;
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
      // Extract content from the file
      const fileContent = await extractFileContent(file);
      
      // Ensure minimum processing time for realistic feel
      const processingTime = Math.random() * 1000 + 1000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate AI content based on the tool selected and file content
      const newContent = generateContent(toolType, fileContent, file.name);
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


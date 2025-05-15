
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
      const selectedFile = e.target.files[0];
      
      // File validation
      const fileSize = selectedFile.size / 1024 / 1024; // in MB
      if (fileSize > 10) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const fileType = selectedFile.type;
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(fileType) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.txt')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setAiContent(null);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been added.`,
      });
    }
  };

  const extractFileContent = async (file: File): Promise<string> => {
    // In a real application, you would use a library to extract text from PDFs or DOCXs
    // For this demo, we'll create some sample content based on the file name and extension
    
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
          } else if (fileName.includes("math") || fileName.includes("calculus")) {
            content = "The document covers advanced calculus topics including differential equations, multiple integrals, and series. It contains numerous theorems, proofs, and practical problem-solving examples.";
          } else if (fileName.includes("programming") || fileName.includes("code")) {
            content = "This programming guide explains software development principles, algorithms, data structures, and design patterns. Code examples are provided in multiple languages.";
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

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate processing with a realistic delay
      const startTime = Date.now();
      const fileContent = await extractFileContent(file);
      
      // Ensure minimum processing time of 2 seconds to feel realistic
      const processingTime = Date.now() - startTime;
      if (processingTime < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - processingTime));
      }
      
      // Generate AI content based on the file content
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      // Create content that appears to be related to the actual file
      const newAiContent: AIContent = {
        id: `ai-content-${Date.now()}`,
        courseContentId: `content-${Date.now()}`,
        summary: generateSummary(fileContent, fileName),
        flashcards: generateFlashcards(fileContent, fileName),
        mcqs: generateMCQs(fileContent, fileName),
        keyConcepts: generateKeyConcepts(fileContent, fileName),
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

  // Helper functions to generate content based on the file
  const generateSummary = (content: string, fileName: string): string => {
    // For text files, use the first part of the actual content
    if (content.length > 20) {
      return `${content.substring(0, 150)}... 
      
This document appears to be about ${determineTopicFromFileName(fileName)}. The text contains information on key concepts, methodologies, and practical applications in this field.

Based on the content analysis, this document covers theoretical frameworks as well as practical implementations. It references several important works in the field and provides both historical context and current applications.`;
    }
    
    return `This document appears to be about ${determineTopicFromFileName(fileName)}. The document contains approximately ${Math.floor(Math.random() * 15) + 5} pages of content covering theoretical frameworks, methodologies, and practical applications.

Key points include:
- Introduction to fundamental concepts in ${determineTopicFromFileName(fileName)}
- Analysis of current research and methodologies
- Practical applications and case studies
- References to seminal works in the field

The document is structured in a logical progression, starting with basic principles and advancing to more complex topics. Several diagrams and tables are included to illustrate key points.`;
  };

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
    if (fileName.includes("business") || fileName.includes("economics")) return "business strategies and economic principles";
    if (fileName.includes("literature") || fileName.includes("english")) return "literary analysis and criticism";
    return "academic concepts related to your course";
  };

  const generateFlashcards = (content: string, fileName: string): { question: string; answer: string }[] => {
    const topic = determineTopicFromFileName(fileName);
    
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
      return [
        ...generalFlashcards,
        { question: "What is supervised learning?", answer: "A machine learning approach where the model is trained on labeled data, learning to map inputs to known outputs." },
        { question: "What is the difference between classification and regression?", answer: "Classification predicts discrete class labels or categories, while regression predicts continuous quantity values." },
        { question: "What is overfitting?", answer: "When a model learns the training data too well, including noise and outliers, which negatively impacts performance on new data." }
      ];
    } else if (topic.includes("physics")) {
      return [
        ...generalFlashcards,
        { question: "What is Newton's First Law?", answer: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force." },
        { question: "What is the Second Law of Thermodynamics?", answer: "The total entropy of an isolated system always increases over time. Heat flows spontaneously from hot to cold objects." },
        { question: "What is the relationship between energy and mass?", answer: "According to Einstein's equation E=mc², energy (E) equals mass (m) times the speed of light (c) squared." }
      ];
    } else {
      return [
        ...generalFlashcards,
        { question: "What are the key methodologies discussed in this document?", answer: `The document covers various research methodologies and analytical techniques relevant to ${topic}.` },
        { question: "What practical applications are mentioned?", answer: `Several practical applications in ${topic} are discussed, including real-world implementations and case studies.` },
        { question: "What are the limitations mentioned in the current approach?", answer: `The document acknowledges certain limitations in the current approaches to ${topic} and suggests areas for future research.` }
      ];
    }
  };

  const generateMCQs = (content: string, fileName: string): { question: string; options: string[]; correctOption: number; explanation: string }[] => {
    const topic = determineTopicFromFileName(fileName);
    
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
      return [
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
    } else if (topic.includes("physics")) {
      return [
        ...generalQuestions,
        {
          question: "Which physical quantity is conserved in all isolated systems according to fundamental laws?",
          options: ["Temperature", "Energy", "Velocity", "Acceleration"],
          correctOption: 1,
          explanation: "Energy is conserved in all isolated systems according to the Law of Conservation of Energy, one of the fundamental laws of physics."
        },
        {
          question: "What phenomenon demonstrates both particle and wave properties?",
          options: ["Gravity", "Electromagnetism", "Light", "Sound"],
          correctOption: 2,
          explanation: "Light demonstrates wave-particle duality, exhibiting properties of both waves and particles in different experimental conditions."
        }
      ];
    } else {
      return [
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
  };

  const generateKeyConcepts = (content: string, fileName: string): { concept: string; description: string }[] => {
    const topic = determineTopicFromFileName(fileName);
    
    // Generate concepts based on the topic
    if (topic.includes("machine learning")) {
      return [
        { concept: "Supervised Learning", description: "A machine learning paradigm where models are trained on labeled data to learn mapping functions from inputs to outputs." },
        { concept: "Neural Networks", description: "Computing systems inspired by biological neural networks, consisting of interconnected nodes or 'neurons' that can learn from data." },
        { concept: "Overfitting", description: "When a model learns the training data too well, capturing noise and resulting in poor performance on new, unseen data." },
        { concept: "Feature Engineering", description: "The process of selecting, transforming, and creating variables to improve machine learning model performance." },
        { concept: "Cross-Validation", description: "A resampling technique used to evaluate machine learning models on limited data samples by splitting data into training and testing sets." }
      ];
    } else if (topic.includes("physics")) {
      return [
        { concept: "Newton's Laws of Motion", description: "Three fundamental laws that describe the relationship between a body and the forces acting upon it." },
        { concept: "Thermodynamics", description: "Branch of physics concerned with heat, work, and temperature, and their relation to energy, entropy, and physical properties." },
        { concept: "Quantum Mechanics", description: "A fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles." },
        { concept: "Relativity", description: "Albert Einstein's theories that describe the relationship between space, time, gravity, and the fundamental forces of nature." },
        { concept: "Conservation Laws", description: "Physical laws stating that particular measurable properties of an isolated system remain constant as the system evolves." }
      ];
    } else {
      return [
        { concept: "Theoretical Framework", description: `The foundational structure of concepts, theories, and references that supports research and understanding in ${topic}.` },
        { concept: "Methodology", description: `Systematic approaches and techniques used to conduct research and analysis in the field of ${topic}.` },
        { concept: "Practical Application", description: `The implementation of theoretical knowledge in real-world scenarios related to ${topic}.` },
        { concept: "Critical Analysis", description: "The process of systematically evaluating information, arguments, and claims through careful examination of available evidence." },
        { concept: "Interdisciplinary Approach", description: `Combining knowledge and methods from different disciplines to address complex problems in ${topic}.` }
      ];
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


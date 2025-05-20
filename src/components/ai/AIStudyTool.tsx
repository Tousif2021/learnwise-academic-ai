import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIContent } from "@/types";
import { 
  BookOpen, 
  FileQuestion, 
  Key, 
  Brain,
  Upload
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
import { summarizeDocument } from "./OpenAI"; // <-- Import OpenAI summarization

const AIStudyTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const { toast } = useToast();

  const tools: ToolOption[] = [
    {
      id: "summary",
      name: "Lecture Summarizer",
      description: "Generate a concise summary with key points from your lecture notes or materials",
      icon: BookOpen
    },
    {
      id: "flashcards",
      name: "Flashcard Generator",
      description: "Create study flashcards automatically from your materials",
      icon: FileQuestion
    },
    {
      id: "mcqs",
      name: "Quiz Generator",
      description: "Generate practice questions to test your knowledge",
      icon: FileQuestion
    },
    {
      id: "concepts",
      name: "Key Concepts",
      description: "Extract and explain important concepts from your materials",
      icon: Key
    },
    {
      id: "explain",
      name: "AI Tutor",
      description: "Get detailed explanations and examples for complex topics",
      icon: Brain
    }
  ];

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
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          resolve(e.target?.result as string);
        } else {
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

  // Canned logic for flashcards, MCQs, and concepts (replace with OpenAI-powered as needed)
  const determineTopicFromFileName = (fileName: string): string => {
    fileName = fileName.toLowerCase();
    if (fileName.includes("machine") || fileName.includes("ai")) return "machine learning and artificial intelligence";
    if (fileName.includes("physics")) return "physics and natural sciences";
    if (fileName.includes("history")) return "historical events and their impacts";
    if (fileName.includes("math") || fileName.includes("calculus")) return "mathematics and calculus";
    if (fileName.includes("programming") || fileName.includes("code")) return "computer programming and software development";
    return "academic concepts related to your course";
  };

  const generateTopicSpecificFlashcards = (topic: string) => {
    if (topic.includes("machine learning")) {
      return [
        { question: "What is supervised learning?", answer: "A machine learning approach where the model is trained on labeled data, learning to map inputs to known outputs." },
        { question: "Explain the concept of overfitting", answer: "When a model learns the training data too well, including noise and outliers, which negatively impacts performance on new data." },
        { question: "What is gradient descent?", answer: "An optimization algorithm used to minimize the loss function by iteratively adjusting model parameters in the direction of steepest descent." },
        { question: "Define cross-validation", answer: "A technique to assess model performance by splitting data into multiple training and validation sets." },
        { question: "What is the difference between bias and variance?", answer: "Bias is error from incorrect assumptions in the model, while variance is error from sensitivity to small fluctuations in the training set." }
      ];
    }

    return [
      { question: `What are the key principles of ${topic}?`, answer: `The key principles include fundamental concepts, methodologies, and practical applications.` },
      { question: "How is theoretical knowledge applied in practice?", answer: "Through case studies, experiments, and real-world applications." },
      { question: "What are the current trends in this field?", answer: "Recent developments include technological advances, new methodologies, and emerging applications." }
    ];
  };

  const generateTopicSpecificMCQs = (topic: string) => {
    if (topic.includes("machine learning")) {
      return [
        {
          question: "Which of the following is NOT a type of machine learning?",
          options: ["Supervised Learning", "Unsupervised Learning", "Determined Learning", "Reinforcement Learning"],
          correctOption: 2,
          explanation: "Determined Learning is not a type of machine learning. The main types are Supervised, Unsupervised, and Reinforcement Learning."
        },
        {
          question: "What is the purpose of the training set in machine learning?",
          options: [
            "To test the final model performance",
            "To validate model hyperparameters",
            "To train the model and learn patterns",
            "To deploy the model in production"
          ],
          correctOption: 2,
          explanation: "The training set is used to train the model by learning patterns and relationships in the data."
        }
      ];
    }

    return [
      {
        question: `Which aspect is most fundamental to ${topic}?`,
        options: ["Theoretical Framework", "Practical Applications", "Historical Context", "Future Developments"],
        correctOption: 0,
        explanation: "The theoretical framework provides the foundation for understanding and applying concepts in this field."
      }
    ];
  };

  const generateTopicSpecificConcepts = (topic: string) => {
    if (topic.includes("machine learning")) {
      return [
        { concept: "Neural Networks", description: "Computing systems inspired by biological neural networks, consisting of interconnected nodes that process and transmit information." },
        { concept: "Deep Learning", description: "A subset of machine learning using multiple layers of neural networks to learn hierarchical representations of data." },
        { concept: "Feature Engineering", description: "The process of selecting, transforming, and creating variables to improve machine learning model performance." },
        { concept: "Model Evaluation", description: "Techniques and metrics used to assess the performance and generalization ability of machine learning models." }
      ];
    }

    return [
      { concept: "Fundamental Principles", description: `The core concepts and theories that form the foundation of ${topic}.` },
      { concept: "Methodology", description: "Systematic approaches and techniques used in the field." },
      { concept: "Applications", description: "Practical implementations and real-world uses of theoretical knowledge." }
    ];
  };

  const generateDetailedExplanation = (topic: string): string => {
    if (topic.includes("machine learning")) {
      return `Let me explain the key concepts in detail:

1. Machine Learning Fundamentals
   - Machine learning is a subset of artificial intelligence that enables systems to learn from data
   - Instead of explicit programming, models learn patterns and relationships automatically
   - The quality and quantity of training data significantly impact model performance

2. Types of Machine Learning
   - Supervised Learning: Learning from labeled data (e.g., classification, regression)
   - Unsupervised Learning: Finding patterns in unlabeled data (e.g., clustering)
   - Reinforcement Learning: Learning through interaction with an environment

3. Common Algorithms and Their Applications
   - Linear Regression: Predicting continuous values
   - Decision Trees: Making hierarchical decisions
   - Neural Networks: Complex pattern recognition
   - Support Vector Machines: Classification and regression

4. Best Practices and Considerations
   - Data preprocessing and cleaning
   - Feature selection and engineering
   - Model selection and hyperparameter tuning
   - Cross-validation and performance evaluation

Would you like me to elaborate on any of these points?`;
    }

    return `Let me explain the key aspects of ${topic}:

1. Fundamental Concepts
   - Core theories and principles
   - Historical development
   - Current state of the field

2. Practical Applications
   - Real-world implementations
   - Case studies and examples
   - Industry best practices

3. Future Developments
   - Emerging trends
   - Research directions
   - Potential applications

Would you like me to elaborate on any of these points?`;
  };

  // MAIN LOGIC: Call OpenAI for summary if summary tool is selected
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
      const fileContent = await extractFileContent(file);
      const processingTime = Math.random() * 1000 + 1000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      const topic = determineTopicFromFileName(file.name);

      const newContent: AIContent = {
        id: `ai-content-${Date.now()}`,
        courseContentId: `content-${Date.now()}`,
        summary: "",
        flashcards: [],
        mcqs: [],
        keyConcepts: [],
        generatedAt: new Date()
      };

      if (toolType === "summary") {
        newContent.summary = await summarizeDocument(fileContent);
      }
      if (toolType === "flashcards") {
        newContent.flashcards = generateTopicSpecificFlashcards(topic);
      }
      if (toolType === "mcqs") {
        newContent.mcqs = generateTopicSpecificMCQs(topic);
      }
      if (toolType === "concepts") {
        newContent.keyConcepts = generateTopicSpecificConcepts(topic);
      }
      if (toolType === "explain") {
        newContent.summary = generateDetailedExplanation(topic);
      }

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

  const resetContent = () => {
    setAiContent(null);
    setSelectedTool(null);
  };

  const resetAll = () => {
    setFile(null);
    setAiContent(null);
    setSelectedTool(null);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="ai-gradient-text">AI Study Assistant</CardTitle>
        <CardDescription>
          Upload lecture notes or study materials to get AI-powered learning support
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default AIStudyTool;

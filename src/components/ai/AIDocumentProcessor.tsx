
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { generateAIContent } from "@/services/mockData";
import { AIContent } from "@/types";
import { Upload, FileText, BookOpen, FileQuestion, Key, Loader2 } from "lucide-react";

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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="ai-gradient-text">AI Document Processor</CardTitle>
        <CardDescription>
          Upload lecture notes or study materials to generate summaries, flashcards, and more
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!file ? (
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            
            <h3 className="text-lg font-medium mb-2">Upload a Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload PDF, DOCX, or TXT files to process with our AI tools
            </p>
            
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button as="span" className="cursor-pointer bg-edu-primary hover:bg-edu-primary/90">
                Select File
              </Button>
            </label>
          </div>
        ) : !aiContent ? (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={24} className="text-edu-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleProcess} 
              disabled={isProcessing}
              className="w-full bg-edu-primary hover:bg-edu-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Document"
              )}
            </Button>
          </div>
        ) : (
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
                onClick={() => {
                  setFile(null);
                  setAiContent(null);
                }}
              >
                New Upload
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Document Summary</h3>
                <p className="text-sm whitespace-pre-line">{aiContent.summary}</p>
              </TabsContent>
              
              {/* Flashcards Tab */}
              <TabsContent value="flashcards">
                <div className="space-y-3">
                  {aiContent.flashcards?.map((card, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="cursor-pointer h-full">
                        <div className="bg-muted p-3">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <p className="text-sm">{card.question}</p>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1">Answer:</h4>
                          <p className="text-sm">{card.answer}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* MCQs Tab */}
              <TabsContent value="mcqs">
                <div className="space-y-4">
                  {aiContent.mcqs?.map((mcq, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium mb-2">Question {index + 1}</h4>
                      <p className="text-sm mb-3">{mcq.question}</p>
                      
                      <div className="space-y-2 mb-3">
                        {mcq.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className={`border p-2 rounded-md text-sm flex items-center ${
                              mcq.correctOption === optIndex 
                                ? "border-green-500 bg-green-50 dark:bg-green-950"
                                : ""
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center border rounded-full mr-2">
                              <span className="text-xs">{String.fromCharCode(65 + optIndex)}</span>
                            </div>
                            {option}
                          </div>
                        ))}
                      </div>
                      
                      {mcq.explanation && (
                        <div className="bg-muted p-3 rounded-md">
                          <h5 className="text-xs font-medium mb-1">Explanation:</h5>
                          <p className="text-xs">{mcq.explanation}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Key Concepts Tab */}
              <TabsContent value="concepts">
                <div className="space-y-3">
                  {aiContent.keyConcepts?.map((concept, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium mb-1">{concept.concept}</h4>
                      <p className="text-sm">{concept.description}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDocumentProcessor;

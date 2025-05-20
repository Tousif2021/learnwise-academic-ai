
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AIContent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import UploadSection from "./document-processor/UploadSection";
import FilePreview from "./document-processor/FilePreview";
import ProcessedDocumentView from "./document-processor/ProcessedDocumentView";
import { extractFileContent, processDocumentWithAI, uploadDocument, askDocumentQuestion } from "@/services/aiDocumentService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";

const questionSchema = z.object({
  question: z.string().min(3, "Question is too short"),
});

interface AIDocumentProcessorProps {
  studentId?: string;
  courseId?: string;
}

const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({ 
  studentId = "default-student", 
  courseId 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [askDialogOpen, setAskDialogOpen] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const questionForm = useForm<{ question: string }>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAiContent(null);
      setDocumentId(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setAiContent(null);
      setDocumentId(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      // Upload document to Supabase
      const uploadResult = await uploadDocument(
        file,
        studentId,
        courseId
      );
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload document");
      }
      
      // Store document ID for later use (e.g., asking questions)
      setDocumentId(uploadResult.data.id);
      
      // Extract content from file
      const fileContent = await extractFileContent(file);
      
      // Process with OpenAI and store in Supabase
      const processingResult = await processDocumentWithAI(
        uploadResult.data.id,
        fileContent
      );
      
      if (!processingResult.success) {
        throw new Error(processingResult.error || "Failed to process document");
      }
      
      // Format content for display
      const { data } = processingResult;
      const newAiContent: AIContent = {
        id: data.id,
        courseContentId: data.document_id,
        summary: data.summary,
        flashcards: data.flashcards,
        mcqs: data.mcqs,
        keyConcepts: Array.isArray(data.key_concepts) 
          ? data.key_concepts.map((item: any) => ({
              concept: item.concept,
              description: item.description
            }))
          : [],
        generatedAt: new Date(data.created_at)
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
        description: error instanceof Error ? error.message : "There was an error processing your document.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setAiContent(null);
    setActiveTab("summary");
    setDocumentId(null);
    setAnswer(null);
  };
  
  const handleAskQuestion = async (data: { question: string }) => {
    if (!documentId) return;
    
    setIsAsking(true);
    setAnswer(null);
    
    try {
      const result = await askDocumentQuestion(documentId, data.question);
      
      if (result.success) {
        setAnswer(result.data.answer);
      } else {
        toast({
          title: "Failed to answer question",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error asking question:", error);
      toast({
        title: "Error",
        description: "Failed to process your question",
        variant: "destructive",
      });
    } finally {
      setIsAsking(false);
    }
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
          <>
            <ProcessedDocumentView
              file={file}
              aiContent={aiContent}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onNewUpload={handleNewUpload}
            />
            
            {documentId && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex gap-2 items-center"
                  onClick={() => setAskDialogOpen(true)}
                >
                  <Search size={16} />
                  Ask a question about this document
                </Button>
              </div>
            )}
          </>
        )}
        
        <Dialog open={askDialogOpen} onOpenChange={setAskDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ask about this document</DialogTitle>
            </DialogHeader>
            
            <Form {...questionForm}>
              <form 
                onSubmit={questionForm.handleSubmit(handleAskQuestion)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={questionForm.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="What is the main thesis of this document?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  disabled={isAsking}
                  className="w-full"
                >
                  {isAsking ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Ask Question"
                  )}
                </Button>
              </form>
            </Form>
            
            {answer && (
              <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Answer:</p>
                <p className="text-sm whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AIDocumentProcessor;

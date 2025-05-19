import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadAreaProps {
  setFile: (file: File | null) => void;
  resetContent: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ setFile, resetContent }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['pdf', 'docx', 'txt'];
      
      if (!validExtensions.includes(fileExtension || '')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      resetContent();
      
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['pdf', 'docx', 'txt'];
      
      if (!validExtensions.includes(fileExtension || '')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(droppedFile);
      resetContent();
      
      toast({
        title: "File uploaded",
        description: `${droppedFile.name} has been uploaded successfully.`,
      });
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive ? 'border-edu-primary bg-edu-primary/5' : 'border-muted'
      }`}
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
      
      <div className="relative">
        <input
          id="ai-file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <Button className="pointer-events-none bg-edu-primary hover:bg-edu-primary/90">
          Select File
        </Button>
      </div>
      
      <p className="mt-4 text-xs text-muted-foreground">
        Maximum file size: 10MB
      </p>
    </div>
  );
};

export default FileUploadArea;

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadAreaProps {
  setFile: (file: File | null) => void;
  resetContent: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ setFile, resetContent }) => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
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
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
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
      className="border-2 border-dashed border-muted rounded-lg p-8 text-center"
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
      
      <label htmlFor="ai-file-upload" className="cursor-pointer">
        <input
          id="ai-file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button className="cursor-pointer bg-edu-primary hover:bg-edu-primary/90">
          Select File
        </Button>
      </label>
    </div>
  );
};

export default FileUploadArea;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadSectionProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(e.dataTransfer.files[0]);
        fileInput.files = dataTransfer.files;
        
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
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
        Upload PDF, DOCX, or TXT files to process with our AI tools
      </p>
      
      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onFileUpload}
          className="hidden"
        />
        <Button className="cursor-pointer bg-edu-primary hover:bg-edu-primary/90">
          Select File
        </Button>
      </label>
      
      <p className="mt-4 text-xs text-muted-foreground">
        Maximum file size: 10MB
      </p>
    </div>
  );
};

export default UploadSection;


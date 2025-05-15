
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadSectionProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileUpload,
}) => {
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? 'border-edu-primary bg-edu-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <h3 className="font-medium">
          {isDragging ? "Drop files here" : "Drag and drop files or click to upload"}
        </h3>
        <p className="text-sm text-muted-foreground">
          You'll be asked to categorize your files after uploading
        </p>
        
        <div className="mt-4">
          <label htmlFor="course-file-upload" className="cursor-pointer">
            <input 
              id="course-file-upload" 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer sr-only" 
              onChange={handleFileUpload} 
              multiple
              accept=".pdf,.docx,.txt,.pptx"
            />
            <Button variant="outline" className="cursor-pointer">
              Choose Files
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;


import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";

interface FilePreviewProps {
  file: File;
  isProcessing: boolean;
  onProcess: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  isProcessing, 
  onProcess 
}) => {
  return (
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
        onClick={onProcess} 
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
  );
};

export default FilePreview;

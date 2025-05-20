import React, { useState } from "react";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizedFile } from "./types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileViewer } from "@/components/ui/file-viewer";

interface FileItemProps {
  file: OrganizedFile;
  formatFileSize: (bytes: number) => string;
  onDelete?: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, formatFileSize, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFileIcon = () => {
    switch (file.type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "txt":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the actual file
    const element = document.createElement("a");
    const fileContent = `This is a simulated download of: ${file.name}`;
    const file1 = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file1);
    element.download = file.name;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center">
          {getFileIcon()}
          <div className="ml-3">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • Uploaded {file.uploadDate.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setPreviewOpen(true)} 
            title="Preview file"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload} 
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              title="Delete file"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <FileViewer 
            file={file.url || file.name} 
            onClose={() => setPreviewOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileItem;
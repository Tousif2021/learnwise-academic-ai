
import React from "react";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { OrganizedFile } from "./types";

interface FileItemProps {
  file: OrganizedFile;
  formatFileSize: (bytes: number) => string;
}

const FileItem: React.FC<FileItemProps> = ({ file, formatFileSize }) => {
  return (
    <div 
      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded">
          <Folder className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        View
      </Button>
    </div>
  );
};

export default FileItem;


import React from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileItem from "./FileItem";
import { OrganizedFile, FileCategory } from "./types";

interface CategoryTabContentProps {
  files: OrganizedFile[];
  category: FileCategory;
  formatFileSize: (bytes: number) => string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryTabContent: React.FC<CategoryTabContentProps> = ({
  files,
  category,
  formatFileSize,
  handleFileUpload,
}) => {
  const filteredFiles = files
    .filter(file => file.category === category)
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

  return (
    <>
      {filteredFiles.length > 0 ? (
        <div className="space-y-2">
          {filteredFiles.map(file => (
            <FileItem
              key={file.id}
              file={file}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
          <FolderPlus className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
          <p>No {category} uploaded yet</p>
          <Button variant="outline" size="sm" className="mt-2 relative">
            Upload {category}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload} 
              multiple
            />
          </Button>
        </div>
      )}
    </>
  );
};

export default CategoryTabContent;

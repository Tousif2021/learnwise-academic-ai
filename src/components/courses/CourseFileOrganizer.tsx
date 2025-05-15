
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Folder } from "lucide-react";
import FileUploadSection from "./file-organizer/FileUploadSection";
import CategoryTabContent from "./file-organizer/CategoryTabContent";
import FileCategoryDialog from "./file-organizer/FileCategoryDialog";
import { OrganizedFile, FileCategory } from "./file-organizer/types";
import { useToast } from "@/hooks/use-toast";

interface CourseFileOrganizerProps {
  courseId: string;
}

const CourseFileOrganizer: React.FC<CourseFileOrganizerProps> = ({ courseId }) => {
  const [files, setFiles] = useState<OrganizedFile[]>([]);
  const [activeTab, setActiveTab] = useState<FileCategory>("lectures");
  const [isDragging, setIsDragging] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // File category counts
  const categoryCounts = files.reduce((acc, file) => {
    acc[file.category] = (acc[file.category] || 0) + 1;
    return acc;
  }, {} as Record<FileCategory, number>);
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Handle file upload prompt
  const handleFileUploadStart = (file: File) => {
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive"
      });
      return;
    }
    
    setPendingFile(file);
    setIsCategoryDialogOpen(true);
  };
  
  // Handle multiple files upload
  const handleFilesUploadStart = (files: FileList) => {
    if (files.length > 0) {
      // Process the first file first
      handleFileUploadStart(files[0]);
      
      // Store remaining files for processing after the first one is categorized
      // In a real app you might want to handle this with a queue system
      if (files.length > 1) {
        toast({
          title: "Multiple files detected",
          description: `You'll be prompted to categorize each file one by one.`,
        });
      }
    }
  };
  
  // Handle file category selection
  const handleCategorySelection = (category: FileCategory) => {
    if (pendingFile) {
      const newFile: OrganizedFile = {
        id: `file-${Date.now()}`,
        name: pendingFile.name,
        size: pendingFile.size,
        type: pendingFile.name.split('.').pop() || "",
        category: category,
        uploadDate: new Date()
      };
      
      setFiles([...files, newFile]);
      setPendingFile(null);
      
      // Auto switch to the category tab of the uploaded file
      setActiveTab(category);
      
      toast({
        title: "File uploaded",
        description: `"${pendingFile.name}" has been added to ${category}.`,
      });
    }
  };
  
  // File upload handler from the upload section
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUploadStart(e.target.files);
    }
  };
  
  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUploadStart(e.dataTransfer.files);
    }
  };

  // Delete file handler
  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed successfully.",
    });
  };
  
  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <FileUploadSection
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleFileUpload={handleFileUpload}
      />
      
      {/* File Browser */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FileCategory)}>
        <TabsList className="grid grid-cols-4">
          {(["lectures", "notes", "exams", "miscellaneous"] as FileCategory[]).map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-1">
              <Folder className="h-4 w-4" />
              <span>{category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category] || 0})</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {(["lectures", "notes", "exams", "miscellaneous"] as FileCategory[]).map((category) => (
          <TabsContent key={category} value={category}>
            <CategoryTabContent
              files={files}
              category={category}
              formatFileSize={formatFileSize}
              handleFileUpload={handleFileUpload}
              onDeleteFile={handleDeleteFile}
            />
          </TabsContent>
        ))}
      </Tabs>
      
      {/* File Category Dialog */}
      <FileCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        fileName={pendingFile?.name || ""}
        onSelectCategory={handleCategorySelection}
      />
    </div>
  );
};

export default CourseFileOrganizer;


import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Folder } from "lucide-react";
import FileUploadSection from "./file-organizer/FileUploadSection";
import CategoryTabContent from "./file-organizer/CategoryTabContent";
import { OrganizedFile, FileCategory } from "./file-organizer/types";

interface CourseFileOrganizerProps {
  courseId: string;
}

const CourseFileOrganizer: React.FC<CourseFileOrganizerProps> = ({ courseId }) => {
  const [files, setFiles] = useState<OrganizedFile[]>([
    {
      id: "file1",
      name: "Lecture 1 - Introduction.pdf",
      size: 1500000,
      type: "pdf",
      category: "lectures",
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "file2",
      name: "My Chapter 2 Notes.docx",
      size: 350000,
      type: "docx",
      category: "notes",
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "file3",
      name: "Practice Exam 2020.pdf",
      size: 2100000,
      type: "pdf",
      category: "exams",
      uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: "file4",
      name: "Lecture 2 - Advanced Topics.pdf",
      size: 1800000,
      type: "pdf",
      category: "lectures",
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "file5",
      name: "Class Syllabus.pdf",
      size: 500000,
      type: "pdf",
      category: "miscellaneous",
      uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<FileCategory>("lectures");
  const [isDragging, setIsDragging] = useState(false);
  
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
  
  // File categorization utility
  const categorizeFile = (fileName: string): FileCategory => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes("lecture")) return "lectures";
    else if (lowerName.includes("notes")) return "notes";
    else if (lowerName.includes("exam") || lowerName.includes("quiz")) return "exams";
    return "miscellaneous";
  };
  
  // Mock file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: OrganizedFile[] = Array.from(e.target.files).map((file, index) => {
        return {
          id: `new-file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || "",
          category: categorizeFile(file.name),
          uploadDate: new Date()
        };
      });
      
      setFiles([...files, ...newFiles]);
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
      const newFiles: OrganizedFile[] = Array.from(e.dataTransfer.files).map((file, index) => {
        return {
          id: `dropped-file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || "",
          category: categorizeFile(file.name),
          uploadDate: new Date()
        };
      });
      
      setFiles([...files, ...newFiles]);
    }
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
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CourseFileOrganizer;

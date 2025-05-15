
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Folder, FolderPlus, Upload } from "lucide-react";

interface CourseFileOrganizerProps {
  courseId: string;
}

type FileCategory = "lectures" | "notes" | "exams" | "miscellaneous";

interface OrganizedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  uploadDate: Date;
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
  
  // Mock file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: OrganizedFile[] = Array.from(e.target.files).map((file, index) => {
        // In a real app, this would be determined by AI analysis
        // For demo purposes, we'll categorize based on filename
        let category: FileCategory = "miscellaneous";
        
        const fileName = file.name.toLowerCase();
        if (fileName.includes("lecture")) category = "lectures";
        else if (fileName.includes("notes")) category = "notes";
        else if (fileName.includes("exam") || fileName.includes("quiz")) category = "exams";
        
        return {
          id: `new-file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || "",
          category,
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
      // In a real app, we would upload these files
      // For demo purposes, just simulate adding them
      const newFiles: OrganizedFile[] = Array.from(e.dataTransfer.files).map((file, index) => {
        // Mock AI categorization
        let category: FileCategory = "miscellaneous";
        const fileName = file.name.toLowerCase();
        if (fileName.includes("lecture")) category = "lectures";
        else if (fileName.includes("notes")) category = "notes";
        else if (fileName.includes("exam") || fileName.includes("quiz")) category = "exams";
        
        return {
          id: `dropped-file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || "",
          category,
          uploadDate: new Date()
        };
      });
      
      setFiles([...files, ...newFiles]);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Upload Section */}
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
            Files will be automatically categorized based on content
          </p>
          
          <div className="mt-4">
            <Button variant="outline" className="relative">
              Choose Files
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload} 
                multiple
              />
            </Button>
          </div>
        </div>
      </div>
      
      {/* File Browser */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FileCategory)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="lectures" className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            <span>Lectures ({categoryCounts.lectures || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            <span>Notes ({categoryCounts.notes || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            <span>Exams ({categoryCounts.exams || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="miscellaneous" className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            <span>Other ({categoryCounts.miscellaneous || 0})</span>
          </TabsTrigger>
        </TabsList>
        
        {["lectures", "notes", "exams", "miscellaneous"].map((category) => (
          <TabsContent key={category} value={category}>
            {files.filter(file => file.category === category).length > 0 ? (
              <div className="space-y-2">
                {files
                  .filter(file => file.category === category)
                  .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
                  .map(file => (
                    <div 
                      key={file.id} 
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CourseFileOrganizer;

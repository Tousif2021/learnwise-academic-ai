
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileCategory } from "./types";
import { Book, FileText, FileQuestion, Folder } from "lucide-react";

interface FileCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onSelectCategory: (category: FileCategory) => void;
}

const categoryOptions: Array<{
  id: FileCategory;
  name: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: "lectures",
    name: "Lecture",
    icon: Book,
    description: "Lecture slides, recordings or notes from class",
  },
  {
    id: "notes",
    name: "Notes",
    icon: FileText,
    description: "Your personal notes or study materials",
  },
  {
    id: "exams",
    name: "Exam",
    icon: FileQuestion,
    description: "Past exams, quizzes, or practice tests",
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous",
    icon: Folder,
    description: "Other course-related documents",
  },
];

const FileCategoryDialog: React.FC<FileCategoryDialogProps> = ({
  isOpen,
  onClose,
  fileName,
  onSelectCategory,
}) => {
  const handleSelectCategory = (category: FileCategory) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Categorize File</DialogTitle>
          <DialogDescription>
            Please select a category for <span className="font-medium">{fileName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {categoryOptions.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="flex flex-col h-auto space-y-2 p-4"
              onClick={() => handleSelectCategory(option.id)}
            >
              <div className="flex justify-center">
                <option.icon className="h-6 w-6 text-edu-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium">{option.name}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileCategoryDialog;

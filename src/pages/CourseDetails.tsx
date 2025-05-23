
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIStudyTool from "@/components/ai/AIStudyTool";
import { Course } from "@/types";
import { Book, Calendar, FolderOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CourseEventsList from "@/components/courses/CourseEventsList";
import CourseFileOrganizer from "@/components/courses/CourseFileOrganizer";
import AddCourseEventButton from "@/components/courses/AddCourseEventButton";
import { useToast } from "@/hooks/use-toast";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API loading
    const loadCourse = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Since we removed sample data, course won't be found
        setCourse(null);
      } catch (error) {
        console.error("Error loading course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details.",
          variant: "destructive",
        });
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, toast]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </AppLayout>
    );
  }

  if (!course) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Book size={24} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Course not found</h2>
              <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist or hasn't been created yet.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return null; // This will never be reached since course is always null now
};

export default CourseDetails;

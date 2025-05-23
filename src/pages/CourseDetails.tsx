
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourseNotes from "@/components/courses/CourseNotes";
import { Course } from "@/types";
import { Book, Calendar, FolderOpen, Brain, FileText, User } from "lucide-react";
import CourseEventsList from "@/components/courses/CourseEventsList";
import CourseFileOrganizer from "@/components/courses/CourseFileOrganizer";
import AddCourseEventButton from "@/components/courses/AddCourseEventButton";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import QuickStats from "@/components/courses/QuickStats";
import CircularProgress from "@/components/courses/CircularProgress";
import EnhancedAIToolsSection from "@/components/courses/EnhancedAIToolsSection";
import MotivationalWidget from "@/components/courses/MotivationalWidget";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load course from localStorage
        const storedCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        const foundCourse = storedCourses.find((c: Course) => c.id === courseId);
        
        setCourse(foundCourse || null);
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: (course as any).color || "#2563eb" }}
                />
                <Badge variant="outline">{course.code}</Badge>
                <Badge variant="outline">{course.semester} {course.year}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              {course.description && (
                <p className="text-muted-foreground mb-4">{course.description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Book size={16} />
                  <span>{course.institution}</span>
                </div>
                {(course as any).instructor && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{(course as any).instructor.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <AddCourseEventButton courseId={course.id} />
              {course.progress !== undefined && (
                <CircularProgress progress={course.progress} />
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats courseId={course.id} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="ai-tools" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai-tools" className="flex items-center gap-2">
                  <Brain size={16} />
                  AI Tools
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText size={16} />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <FolderOpen size={16} />
                  Files
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-tools">
                {(course as any).settings?.aiTools?.length > 0 ? (
                  <EnhancedAIToolsSection courseId={course.id} />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12">
                      <Brain size={48} className="text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No AI tools enabled</h3>
                      <p className="text-muted-foreground text-center">
                        AI tools were not enabled for this course during creation. You can still use the general AI tools from the dashboard.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes">
                {(course as any).settings?.enableNoteTaking ? (
                  <CourseNotes courseId={course.id} />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12">
                      <FileText size={48} className="text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Note taking disabled</h3>
                      <p className="text-muted-foreground text-center">
                        Note taking was not enabled for this course during creation.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="files">
                <CourseFileOrganizer courseId={course.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Events Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar size={18} />
                    Upcoming Events
                  </CardTitle>
                  <AddCourseEventButton courseId={course.id} />
                </div>
              </CardHeader>
              <CardContent>
                <CourseEventsList courseId={course.id} />
              </CardContent>
            </Card>

            {/* Motivational Widget */}
            <MotivationalWidget />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetails;

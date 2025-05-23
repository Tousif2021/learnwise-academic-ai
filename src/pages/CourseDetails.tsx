
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIStudyTool from "@/components/ai/AIStudyTool";
import CourseNotes from "@/components/courses/CourseNotes";
import { Course } from "@/types";
import { Book, Calendar, FolderOpen, Brain, FileText, HelpCircle, TrendingUp, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CourseEventsList from "@/components/courses/CourseEventsList";
import CourseFileOrganizer from "@/components/courses/CourseFileOrganizer";
import AddCourseEventButton from "@/components/courses/AddCourseEventButton";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

  const aiToolIcons = {
    summarizer: FileText,
    flashcards: Brain,
    quiz_maker: HelpCircle,
  };

  const aiToolLabels = {
    summarizer: "AI Summarizer",
    flashcards: "Flashcard Maker", 
    quiz_maker: "Quiz Maker",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
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
            
            <div className="flex items-center gap-3">
              <AddCourseEventButton courseId={course.id} />
            </div>
          </div>
          
          {course.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span>{Math.round(course.progress)}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Course Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Tools Available */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain size={18} className="text-edu-primary" />
                    Available AI Tools
                  </CardTitle>
                  <CardDescription>
                    AI tools enabled for this course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(course as any).settings?.aiTools?.length > 0 ? (
                    <div className="grid gap-3">
                      {(course as any).settings.aiTools.map((tool: string) => {
                        const Icon = aiToolIcons[tool as keyof typeof aiToolIcons];
                        return (
                          <div key={tool} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Icon size={20} className="text-edu-primary" />
                            <span className="font-medium">{aiToolLabels[tool as keyof typeof aiToolLabels]}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No AI tools enabled for this course</p>
                  )}
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen size={18} className="text-edu-primary" />
                    Course Features
                  </CardTitle>
                  <CardDescription>
                    Enabled features for this course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      <span>Grade Predictor</span>
                    </div>
                    <Badge variant={(course as any).settings?.enableGradePredictor ? "default" : "secondary"}>
                      {(course as any).settings?.enableGradePredictor ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>Note Taking</span>
                    </div>
                    <Badge variant={(course as any).settings?.enableNoteTaking ? "default" : "secondary"}>
                      {(course as any).settings?.enableNoteTaking ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-tools">
            {(course as any).settings?.aiTools?.length > 0 ? (
              <AIStudyTool />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Brain size={48} className="text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No AI tools enabled</h3>
                  <p className="text-muted-foreground text-center">
                    AI tools were not enabled for this course during creation.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes">
            {(course as any).settings?.enableNoteTaking ? (
              <CourseNotes courseId={course.id} />
            ) : (
              <Card>
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

          <TabsContent value="events">
            <CourseEventsList courseId={course.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CourseDetails;

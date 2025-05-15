import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIDocumentProcessor from "@/components/ai/AIDocumentProcessor";
import AIToolsCard from "@/components/dashboard/AIToolsCard";
import { fetchCourseById } from "@/services/mockData";
import { Course } from "@/types";
import { Book, Calendar, FolderOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CourseEventsList from "@/components/courses/CourseEventsList";
import CourseFileOrganizer from "@/components/courses/CourseFileOrganizer";

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        if (courseId) {
          const courseData = await fetchCourseById(courseId);
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  // Predict grade based on progress
  const predictGrade = (progress: number) => {
    if (progress >= 0.9) return "A";
    if (progress >= 0.8) return "B";
    if (progress >= 0.7) return "C";
    if (progress >= 0.6) return "D";
    return "F";
  };

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
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h2 className="text-2xl font-bold">Course not found</h2>
              <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div 
          className="h-48 rounded-lg p-6 mb-6 flex flex-col justify-between text-white"
          style={{ 
            backgroundColor: course.color || "#2563eb",
            backgroundImage: course.coverImage ? 
              `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(${course.coverImage})` : 
              undefined,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
              {course.code}
            </span>
            {course.progress !== undefined && (
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                {Math.round(course.progress * 100)}% Complete
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm">
                <Book size={14} />
                <span>{course.institution}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar size={14} />
                <span>{course.schedule?.days.join(", ")} at {course.schedule?.startTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
              </CardContent>
            </Card>

            {/* Upcoming Events Card */}
            <CourseEventsList courseId={courseId || ""} />

            {/* Grade Prediction Card */}
            {course.progress !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle>Progress & Grade Prediction</CardTitle>
                  <CardDescription>Based on your current progress in this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Course Progress</span>
                        <span className="font-medium">{Math.round(course.progress * 100)}%</span>
                      </div>
                      <Progress value={course.progress * 100} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted Grade</p>
                        <p className="text-lg font-bold mt-1">{predictGrade(course.progress)}</p>
                      </div>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                        course.progress >= 0.8 ? 'bg-green-500' : 
                        course.progress >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {predictGrade(course.progress)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      This prediction is based on your current progress and may change as you complete more course materials.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* File Organizer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-edu-primary" />
                  Course Files
                </CardTitle>
                <CardDescription>
                  Upload and organize your course materials automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseFileOrganizer courseId={courseId || ""} />
              </CardContent>
            </Card>
            
            {/* AI Document Processor */}
            <AIDocumentProcessor />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tools Card */}
            <AIToolsCard />

            {/* Instructor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {course.instructors[0]?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{course.instructors[0]?.name}</h3>
                    <p className="text-sm text-muted-foreground">Professor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetails;

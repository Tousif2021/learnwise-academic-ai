
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

// Sample course data (in a real app, this would come from an API)
const sampleCourse: Course = {
  id: "course-1",
  code: "CS101",
  title: "Introduction to Computer Science",
  description: "An introductory course to the fundamental concepts of computer science. This course covers basic programming concepts, algorithms, data structures, and computational thinking. Students will learn problem-solving approaches, debugging techniques, and the foundations of software development. The course is designed to provide a solid foundation for further study in computer science and related fields.",
  institution: "Online University",
  semester: "fall",
  year: 2025,
  enrolled: 120,
  progress: 0.2,
  instructors: [
    {
      name: "Dr. Alan Turing",
      email: "alan.turing@online.edu",
      photoURL: "https://i.pravatar.cc/150?img=11"
    }
  ],
  schedule: {
    days: ["Monday", "Wednesday", "Friday"],
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    location: "Building A, Room 101"
  },
  color: "#2563eb",
  createdAt: new Date(),
};

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API loading
    const loadCourse = async () => {
      try {
        // In a real app, fetch course data from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes: either use sample data or simulate not found
        if (courseId === "course-1") {
          setCourse(sampleCourse);
        } else {
          // Create a new course based on the courseId
          const newCourse = {
            ...sampleCourse,
            id: courseId || "unknown",
            title: courseId === "course-2" ? "Calculus II" : `Course ${courseId}`,
            code: courseId === "course-2" ? "MATH201" : `CODE${courseId?.slice(-3)}`,
            color: courseId === "course-2" ? "#db2777" : "#16a34a",
            progress: Math.random(),
          };
          setCourse(newCourse);
        }
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

            {/* AI Study Tool - moved to appear right after the course description */}
            <AIStudyTool />
            
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
            
            {/* Upcoming Events Card with Add Event Button */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={18} className="text-edu-primary" />
                    Course Events
                  </CardTitle>
                  <CardDescription>
                    Upcoming assignments, quizzes, and deadlines
                  </CardDescription>
                </div>
                <AddCourseEventButton courseId={courseId || ""} />
              </CardHeader>
              <CardContent>
                <CourseEventsList courseId={courseId || ""} />
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetails;

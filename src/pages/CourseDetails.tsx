
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIDocumentProcessor from "@/components/ai/AIDocumentProcessor";
import AIToolsCard from "@/components/dashboard/AIToolsCard";
import { fetchCourseById } from "@/services/mockData";
import { Course } from "@/types";
import { Book, Users, Calendar } from "lucide-react";

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
                <Users size={14} />
                <span>{course.enrolled} students</span>
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
            
            {/* AI Document Processor moved from dashboard to course page */}
            <AIDocumentProcessor />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tools Card moved from dashboard to course page */}
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

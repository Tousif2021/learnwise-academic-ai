
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import CourseCard from "@/components/dashboard/CourseCard";
import UpcomingTasksCard from "@/components/dashboard/UpcomingTasksCard";
import { User, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AIToolsCard from "@/components/dashboard/AIToolsCard";

// Sample user data (in a real app, this would come from authentication)
const sampleUser: User = {
  id: "user-1",
  displayName: "Guest User",
  email: "guest@example.com",
  photoURL: "https://i.pravatar.cc/150?img=3",
  institution: {
    name: "Online University",
    domain: "online.edu",
  },
  createdAt: new Date(),
  lastLogin: new Date()
};

// Sample course data (in a real app, this would come from an API)
const sampleCourses: Course[] = [
  {
    id: "course-1",
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "An introductory course to the fundamental concepts of computer science.",
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
  },
  {
    id: "course-2",
    code: "MATH201",
    title: "Calculus II",
    description: "A continuation of Calculus I, covering integration, series, and applications.",
    institution: "Online University",
    semester: "spring",
    year: 2025,
    enrolled: 85,
    progress: 0.1,
    instructors: [
      {
        name: "Dr. Ada Lovelace",
        email: "ada.lovelace@online.edu",
        photoURL: "https://i.pravatar.cc/150?img=5"
      }
    ],
    schedule: {
      days: ["Tuesday", "Thursday"],
      startTime: "10:30 AM",
      endTime: "12:00 PM",
      location: "Building B, Room 202"
    },
    color: "#db2777",
    createdAt: new Date(),
  }
];

const Index = () => {
  const [user] = useState<User | null>(sampleUser);
  const [courses] = useState<Course[]>(sampleCourses);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <WelcomeCard user={user} />
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Courses</h2>
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <Link to="/courses">
                    <Plus size={16} />
                    <span>Add Course</span>
                  </Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.slice(0, 4).map((course) => (
                    <Link to={`/courses/${course.id}`} key={course.id}>
                      <CourseCard course={course} />
                    </Link>
                  ))}
                </div>
              )}
              
              {courses.length > 0 && (
                <div className="mt-4 text-center">
                  <Link to="/courses">
                    <Button variant="link">View all {courses.length} courses</Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* AI Tools Card */}
            <AIToolsCard />
          </div>
          
          {/* Right Column - Tasks */}
          <div className="space-y-6">
            <UpcomingTasksCard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;

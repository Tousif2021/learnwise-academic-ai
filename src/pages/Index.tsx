
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import CourseCard from "@/components/dashboard/CourseCard";
import UpcomingTasksCard from "@/components/dashboard/UpcomingTasksCard";
import { fetchCurrentUser, fetchCourses } from "@/services/mockData";
import { User, Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user and courses data
        const userData = await fetchCurrentUser();
        const coursesData = await fetchCourses();
        
        setUser(userData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

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
              
              {courses.length > 4 && (
                <div className="mt-4 text-center">
                  <Link to="/courses">
                    <Button variant="link">View all {courses.length} courses</Button>
                  </Link>
                </div>
              )}
            </div>
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

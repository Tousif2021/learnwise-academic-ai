
import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import EnhancedCourseCard from "@/components/dashboard/EnhancedCourseCard";
import InteractiveUpcomingTasksCard from "@/components/dashboard/InteractiveUpcomingTasksCard";
import MotivationalQuotesCard from "@/components/dashboard/MotivationalQuotesCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import AIToolsCard from "@/components/dashboard/AIToolsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/userDataService";

// Updated fetch function to get courses from localStorage
const fetchUserCoursesFromLocalStorage = async () => {
  const storedCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
  return storedCourses;
};

const Index = () => {
  const { user } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!user,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['userCourses'],
    queryFn: fetchUserCoursesFromLocalStorage,
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <WelcomeCard user={currentUser} />
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Courses</h2>
                <Button size="sm" variant="outline" className="gap-1 hover:scale-105 transition-transform" asChild>
                  <Link to="/courses/add">
                    <Plus size={16} />
                    <span>Add Course</span>
                  </Link>
                </Button>
              </div>
              
              {coursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.slice(0, 4).map((course) => (
                    <Link to={`/courses/${course.id}`} key={course.id}>
                      <EnhancedCourseCard course={course} />
                    </Link>
                  ))}
                  {courses.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      <p className="mb-4">No courses enrolled yet</p>
                      <Button className="hover:scale-105 transition-transform" asChild>
                        <Link to="/courses/add">Add Your First Course</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {courses.length > 4 && (
                <div className="mt-4 text-center">
                  <Link to="/courses">
                    <Button variant="link" className="hover:scale-105 transition-transform">
                      View all {courses.length} courses
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* AI Tools Card */}
            <AIToolsCard />
          </div>
          
          {/* Right Column - Tasks and Motivation */}
          <div className="space-y-6">
            <InteractiveUpcomingTasksCard />
            <MotivationalQuotesCard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;

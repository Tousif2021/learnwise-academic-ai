
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Floating gradient orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-subtle"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-subtle animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-subtle animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-20"></div>
      
      <AppLayout>
        <div className="max-w-7xl mx-auto relative z-10">
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
    </div>
  );
};

export default Index;

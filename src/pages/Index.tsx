
import React from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import CourseCard from "@/components/dashboard/CourseCard";
import UpcomingTasksCard from "@/components/dashboard/UpcomingTasksCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AIToolsCard from "@/components/dashboard/AIToolsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/userDataService";
import { fetchUserCourses } from "@/services/courseDataService";

const Index = () => {
  const { user } = useAuth();

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!user,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['userCourses', user?.id],
    queryFn: () => user ? fetchUserCourses(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const isLoading = userLoading || coursesLoading;

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
                  {courses.length === 0 && !isLoading && (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      <p className="mb-4">No courses enrolled yet</p>
                      <Button asChild>
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  )}
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


import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import CourseCard from "@/components/dashboard/CourseCard";
import { Course } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "newest" | "alphabetical" | "progress";
type SemesterOption = "all" | "fall" | "spring" | "summer" | "winter";

// Updated fetch function to get courses from localStorage
const fetchUserCourses = async (): Promise<Course[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
  
  const storedCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
  return storedCourses;
};

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [semester, setSemester] = useState<SemesterOption>("all");
  
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['user-courses'],
    queryFn: fetchUserCourses
  });
  
  // Filter courses based on search term and semester
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = semester === "all" || course.semester === semester;
    
    return matchesSearch && matchesSemester;
  });
  
  // Sort filtered courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "progress":
        return (b.progress || 0) - (a.progress || 0);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage all your enrolled courses
            </p>
          </div>
          <Button size="sm" asChild>
            <Link to="/courses/add">
              <Plus size={16} className="mr-1" />
              Add New Course
            </Link>
          </Button>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Semester</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={semester} onValueChange={(value) => setSemester(value as SemesterOption)}>
                  <DropdownMenuRadioItem value="all">All Semesters</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fall">Fall</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="spring">Spring</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="summer">Summer</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="winter">Winter</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy === "newest" ? "Newest" : sortBy === "alphabetical" ? "A-Z" : "Progress"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="progress">By Progress</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-32 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium">
              {searchTerm ? "No courses found" : "No courses yet"}
            </h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term" : "Create your first course to get started"}
            </p>
            {!searchTerm && (
              <Button className="mt-4" asChild>
                <Link to="/courses/add">
                  <Plus size={16} className="mr-1" />
                  Add Your First Course
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Courses;

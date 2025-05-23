
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import AddEventDialog from "@/components/calendar/AddEventDialog";
import { Course } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Fetch courses from localStorage
const fetchCoursesFromLocalStorage = async (): Promise<Course[]> => {
  const storedCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
  return storedCourses;
};

interface AddCourseEventButtonProps {
  courseId: string;
}

const AddCourseEventButton: React.FC<AddCourseEventButtonProps> = ({ courseId }) => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // Fetch all courses from localStorage for the event dialog
  const { data: courses } = useQuery({
    queryKey: ['userCourses'],
    queryFn: fetchCoursesFromLocalStorage
  });

  // Find the current course from the courses list
  const currentCourse = courses?.find(c => c.id === courseId);
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAddEventOpen(true)}
        className="flex items-center gap-2"
      >
        <CalendarPlus size={16} />
        Add Event
      </Button>
      
      {courses && (
        <AddEventDialog 
          open={isAddEventOpen} 
          onOpenChange={setIsAddEventOpen}
          courses={courses}
          preselectedCourseId={courseId}
        />
      )}
    </>
  );
};

export default AddCourseEventButton;

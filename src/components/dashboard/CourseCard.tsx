
import React from "react";
import { Card } from "@/components/ui/card";
import { Course } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getBgStyle = () => {
    if (course.coverImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(${course.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor: course.color || "#2563eb" };
  };

  // Format the next class time
  const formatNextClass = () => {
    if (!course.schedule) return "No schedule available";
    
    const today = new Date().getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Find the next class day
    const scheduleDays = course.schedule.days.map(day => dayNames.indexOf(day));
    const nextDayIndex = scheduleDays.find(day => day > today) || scheduleDays[0];
    const nextDay = dayNames[nextDayIndex];
    
    return `${nextDay} at ${course.schedule.startTime}`;
  };

  return (
    <Card className="course-card h-full flex flex-col">
      <div 
        className="h-32 p-4 flex flex-col justify-between text-white"
        style={getBgStyle()}
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
        <h3 className="text-lg font-bold">{course.title}</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        </div>
        
        <div className="mt-auto space-y-3">
          {course.progress !== undefined && (
            <div className="space-y-1">
              <Progress value={course.progress * 100} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{course.enrolled} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatNextClass()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;

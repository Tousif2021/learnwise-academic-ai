
import React from "react";
import { Card } from "@/components/ui/card";
import { Course } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

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

  // Predict grade based on progress
  const predictGrade = (progress: number) => {
    if (progress >= 0.9) return "A";
    if (progress >= 0.8) return "B";
    if (progress >= 0.7) return "C";
    if (progress >= 0.6) return "D";
    return "F";
  };

  return (
    <Card className="course-card h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(course.progress * 100)}%</span>
              </div>
              <Progress value={course.progress * 100} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Predicted Grade</span>
                <div className={`text-xs font-bold px-2 py-1 rounded-md ${
                  course.progress >= 0.8 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                  course.progress >= 0.6 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {predictGrade(course.progress)}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end text-xs text-muted-foreground">
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

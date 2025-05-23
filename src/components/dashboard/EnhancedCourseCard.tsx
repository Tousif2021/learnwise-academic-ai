
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import { Course } from "@/types";

interface EnhancedCourseCardProps {
  course: Course;
}

const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({ course }) => {
  return (
    <Card className="group course-card hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden cursor-pointer">
      <div 
        className="h-2 w-full transition-all duration-300 group-hover:h-3"
        style={{ backgroundColor: course.color || "#6366f1" }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-200 truncate">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {course.code}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="ml-2 group-hover:scale-110 transition-transform duration-200"
          >
            {course.semester} {course.year}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-200">
          {course.description}
        </p>
        
        {course.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium group-hover:text-primary transition-colors">
                {course.progress}%
              </span>
            </div>
            <Progress 
              value={course.progress} 
              className="h-2 group-hover:h-3 transition-all duration-300" 
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {course.schedule && (
              <div className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                <Clock size={12} />
                <span>{course.schedule.startTime}</span>
              </div>
            )}
            
            {course.enrolled && (
              <div className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                <Users size={12} />
                <span>{course.enrolled}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
            <BookOpen size={12} />
            <span>View</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCourseCard;

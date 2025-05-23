
import React from "react";
import { Clock } from "lucide-react";
import { useEvents } from "@/hooks/use-events";

interface CourseEventsListProps {
  courseId: string;
}

const CourseEventsList: React.FC<CourseEventsListProps> = ({ courseId }) => {
  const { data: allEvents, isLoading } = useEvents();

  // Format due date to relative time (e.g., "2 days left")
  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    return `Due in ${diffDays} days`;
  };

  // Event type badge style
  const getEventTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      quiz: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      lecture: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      lab: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      project: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      meeting: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    };
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[type] || styles.other}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Filter events for this specific course
  const courseEvents = allEvents?.filter(event => event.course?.id === courseId) || [];

  if (courseEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No upcoming events for this course</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courseEvents.map((event) => (
        <div 
          key={event.id}
          className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{event.title}</h4>
              {getEventTypeBadge(event.type)}
            </div>
            
            <div className="flex items-center gap-4">
              {event.description && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {event.description}
                </span>
              )}
              
              <div className="flex items-center text-xs">
                <Clock size={12} className="mr-1" />
                <span className="text-muted-foreground">
                  {formatDueDate(new Date(event.dueDate))}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseEventsList;

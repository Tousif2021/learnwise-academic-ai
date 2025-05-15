
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCourseEvents } from "@/services/mockData";
import { Calendar, Clock } from "lucide-react";

interface CourseEvent {
  id: string;
  title: string;
  type: "assignment" | "quiz" | "exam" | "lecture" | "lab";
  dueDate: Date;
  description?: string;
}

interface CourseEventsListProps {
  courseId: string;
}

const CourseEventsList: React.FC<CourseEventsListProps> = ({ courseId }) => {
  const [events, setEvents] = useState<CourseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchCourseEvents(courseId);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error loading course events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [courseId]);

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
  const getEventTypeBadge = (type: CourseEvent["type"]) => {
    const styles = {
      assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      quiz: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      lecture: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      lab: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    };
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} className="text-edu-primary" />
            Upcoming Course Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={18} className="text-edu-primary" />
          Upcoming Course Events
        </CardTitle>
        <CardDescription>
          Upcoming assignments, quizzes, and deadlines for this course
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
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
                        {formatDueDate(event.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming events for this course!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseEventsList;

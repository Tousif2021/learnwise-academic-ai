
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUpcomingEvents } from "@/hooks/use-events";
import { format, isToday, isTomorrow } from "date-fns";

const UpcomingTasksCard: React.FC = () => {
  const { data: upcomingEvents = [], isLoading } = useUpcomingEvents(5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} className="text-edu-primary" />
            Upcoming Tasks
          </CardTitle>
          <CardDescription>
            Your upcoming assignments, quizzes, and exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventTypeBadgeStyle = (type: string) => {
    const styles: Record<string, string> = {
      assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      quiz: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      meeting: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      lecture: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      lab: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      project: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    };
    return styles[type] || styles.other;
  };

  const formatEventDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={18} className="text-edu-primary" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription>
          Your upcoming assignments, quizzes, and exams
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.dueDate);
              return (
                <div 
                  key={event.id}
                  className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors border border-border/30"
                >
                  <div 
                    className="w-1 h-12 rounded-full mr-3"
                    style={{ backgroundColor: event.course?.color || "#6d28d9" }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ml-2 ${getEventTypeBadgeStyle(event.type)}`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{formatEventDate(eventDate)} at {format(eventDate, 'h:mm a')}</span>
                      </div>
                      
                      {event.course && (
                        <span className="truncate">
                          {event.course.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/calendar">
                  View All Events
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
            <p className="text-muted-foreground mb-4">
              Add events to your calendar to see them here
            </p>
            <Button size="sm" asChild>
              <Link to="/calendar">
                <Plus size={16} className="mr-1" />
                Add Your First Event
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasksCard;

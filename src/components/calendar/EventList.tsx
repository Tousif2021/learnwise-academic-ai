
import React from "react";
import { useEvents } from "@/hooks/use-events";
import { Clock, Bookmark } from "lucide-react";

interface EventListProps {
  date?: Date;
  eventType?: string;
  limit?: number;
}

const EventList: React.FC<EventListProps> = ({ date, eventType, limit }) => {
  const { data: events, isLoading } = useEvents({ date, type: eventType, limit });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No events scheduled for this {date ? 'date' : 'period'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div 
          key={event.id}
          className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div 
            className="w-1.5 h-12 rounded mr-3"
            style={{ backgroundColor: event.course?.color || "#6d28d9" }}
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{event.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeBadgeStyle(event.type)}`}>
                {formatEventType(event.type)}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {event.course && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bookmark size={12} />
                  {event.course.code || event.course.title}
                </span>
              )}
              
              <div className="flex items-center text-xs">
                <Clock size={12} className="mr-1" />
                <span className="text-muted-foreground">
                  {formatEventTime(event.dueDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper functions
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

const formatEventType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const formatEventTime = (date: Date) => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const eventDate = new Date(date);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  if (diffDays === 0) return `Today at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return `Tomorrow at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays > 1 && diffDays < 7) return `${eventDate.toLocaleDateString([], { weekday: 'long' })} at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return eventDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default EventList;

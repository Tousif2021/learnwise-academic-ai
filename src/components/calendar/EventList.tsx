
import React from "react";
import { useEvents } from "@/hooks/use-events";
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from "date-fns";
import { Clock, Bookmark, Calendar, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventListProps {
  date?: Date;
  eventType?: string;
  limit?: number;
  month?: number;
  year?: number;
}

const EventList: React.FC<EventListProps> = ({ date, eventType, limit, month, year }) => {
  const { data: events, isLoading } = useEvents({ date, type: eventType, limit, month, year });
  
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
        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>No events scheduled for this {date ? 'date' : 'period'}</p>
      </div>
    );
  }
  
  // Group events by date
  const groupedEvents: Record<string, typeof events> = {};
  
  events.forEach(event => {
    const eventDate = new Date(event.dueDate);
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    
    groupedEvents[dateKey].push(event);
  });
  
  return (
    <div className="space-y-5">
      {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => {
        const eventDate = new Date(dateEvents[0].dueDate);
        const isDateToday = isToday(eventDate);
        const isDateTomorrow = isTomorrow(eventDate);
        
        return (
          <div key={dateKey}>
            <div className="flex items-center gap-2 mb-2">
              {isDateToday ? (
                <Badge variant="default" className="rounded-full px-2 py-0.5 text-[10px]">TODAY</Badge>
              ) : isDateTomorrow ? (
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">TOMORROW</Badge>
              ) : null}
              <h4 className={`text-sm font-medium ${isDateToday ? 'text-primary' : ''}`}>
                {formatDateGroupHeader(eventDate)}
              </h4>
            </div>
            
            <div className="space-y-2">
              {dateEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors border border-border/30"
                >
                  <div 
                    className="w-1.5 h-12 rounded-full mr-3"
                    style={{ backgroundColor: event.course?.color || "#6d28d9" }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getEventTypeBadgeStyle(event.type)}`}>
                        {formatEventType(event.type)}
                      </Badge>
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
                          {format(new Date(event.dueDate), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
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

const formatDateGroupHeader = (date: Date) => {
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isThisWeek(date)) {
    // For this week, display the day name
    return format(date, 'EEEE');
  } else if (isThisMonth(date)) {
    // For this month, display the day and date
    return format(date, 'EEEE, MMMM d');
  } else {
    // For other dates, display the full date
    return format(date, 'MMMM d, yyyy');
  }
};

export default EventList;

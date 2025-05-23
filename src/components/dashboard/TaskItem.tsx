
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Check } from "lucide-react";
import { format, isToday, isTomorrow, differenceInHours, differenceInDays } from "date-fns";
import { EventType } from "@/types";

interface TaskItemProps {
  event: EventType;
  onComplete: (eventId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ event, onComplete }) => {
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

  const getCountdown = (date: Date) => {
    const now = new Date();
    const hours = differenceInHours(date, now);
    const days = differenceInDays(date, now);
    
    if (hours < 24) {
      return `${hours}h left`;
    }
    return `${days}d left`;
  };

  const getUrgencyLevel = (date: Date) => {
    const hours = differenceInHours(date, new Date());
    if (hours < 24) return "urgent";
    if (hours < 72) return "soon";
    return "normal";
  };

  const eventDate = new Date(event.dueDate);
  const urgency = getUrgencyLevel(eventDate);

  return (
    <div 
      className={`group flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-200 border border-border/30 hover:border-primary/30 ${
        urgency === "urgent" ? "ring-2 ring-red-200 dark:ring-red-800" : ""
      }`}
    >
      <div 
        className="w-1.5 h-12 rounded-full mr-3 transition-all duration-200"
        style={{ backgroundColor: event.course?.color || "#6d28d9" }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {event.title}
          </h4>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getEventTypeBadgeStyle(event.type)}`}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-100 hover:text-green-700"
              onClick={() => onComplete(event.id)}
            >
              <Check size={12} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>{formatEventDate(eventDate)} at {format(eventDate, 'h:mm a')}</span>
          </div>
          
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            urgency === "urgent" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
            urgency === "soon" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          }`}>
            {getCountdown(eventDate)}
          </div>
          
          {event.course && (
            <span className="truncate">
              {event.course.code}
            </span>
          )}
        </div>
        
        {urgency === "urgent" && (
          <div className="mt-2">
            <Progress value={75} className="h-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

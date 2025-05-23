
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Clock, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUpcomingEvents, useCompleteTask } from "@/hooks/use-events";
import { format, isToday, isTomorrow, differenceInHours, differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InteractiveUpcomingTasksCard: React.FC = () => {
  const { data: upcomingEvents = [], isLoading } = useUpcomingEvents(10);
  const { completeTask } = useCompleteTask();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "type">("date");

  if (isLoading) {
    return (
      <Card className="hover:shadow-xl transition-shadow duration-300">
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

  const handleCompleteTask = async (eventId: string) => {
    await completeTask(eventId);
  };

  // Filter and sort events
  const filteredEvents = upcomingEvents
    .filter(event => filter === "all" || event.type === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.type.localeCompare(b.type);
    });

  const eventTypes = [...new Set(upcomingEvents.map(event => event.type))];

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-edu-primary" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              Your upcoming assignments, quizzes, and exams
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={14} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Tasks
              </DropdownMenuItem>
              {eventTypes.map(type => (
                <DropdownMenuItem key={type} onClick={() => setFilter(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredEvents.length > 0 ? (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.dueDate);
              const urgency = getUrgencyLevel(eventDate);
              
              return (
                <div 
                  key={event.id}
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
                          onClick={() => handleCompleteTask(event.id)}
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
            })}
            
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="w-full hover:bg-primary/10 transition-colors" asChild>
                <Link to="/calendar">
                  View All Events
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 hover:bg-muted/80 transition-colors">
              <Calendar size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
            <p className="text-muted-foreground mb-4">
              Add events to your calendar to see them here
            </p>
            <Button size="sm" className="hover:scale-105 transition-transform" asChild>
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

export default InteractiveUpcomingTasksCard;

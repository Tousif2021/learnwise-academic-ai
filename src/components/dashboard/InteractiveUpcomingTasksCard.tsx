
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUpcomingEvents, useCompleteTask } from "@/hooks/use-events";
import TaskItem from "./TaskItem";
import TaskFilter from "./TaskFilter";
import TasksEmptyState from "./TasksEmptyState";
import TasksLoadingState from "./TasksLoadingState";

const InteractiveUpcomingTasksCard: React.FC = () => {
  const { data: upcomingEvents = [], isLoading } = useUpcomingEvents(10);
  const { completeTask } = useCompleteTask();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "type">("date");

  if (isLoading) {
    return <TasksLoadingState />;
  }

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

  // Extract unique event types with proper typing
  const eventTypes: string[] = Array.from(
    new Set(
      upcomingEvents
        .map(event => event.type)
        .filter((type): type is string => typeof type === 'string' && type.length > 0)
    )
  );

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
          
          <TaskFilter 
            filter={filter}
            eventTypes={eventTypes}
            onFilterChange={setFilter}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredEvents.length > 0 ? (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <TaskItem
                key={event.id}
                event={event}
                onComplete={handleCompleteTask}
              />
            ))}
            
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="w-full hover:bg-primary/10 transition-colors" asChild>
                <Link to="/calendar">
                  View All Events
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <TasksEmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveUpcomingTasksCard;

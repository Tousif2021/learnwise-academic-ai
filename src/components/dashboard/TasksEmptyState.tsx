
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const TasksEmptyState: React.FC = () => {
  return (
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
  );
};

export default TasksEmptyState;

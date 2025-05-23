
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UpcomingTasksCard: React.FC = () => {
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
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">
            Add courses and events to see your upcoming tasks here
          </p>
          <Button size="sm" asChild>
            <Link to="/courses/add">
              <Plus size={16} className="mr-1" />
              Add Your First Course
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTasksCard;

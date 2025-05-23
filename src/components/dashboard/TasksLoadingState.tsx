
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const TasksLoadingState: React.FC = () => {
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
};

export default TasksLoadingState;

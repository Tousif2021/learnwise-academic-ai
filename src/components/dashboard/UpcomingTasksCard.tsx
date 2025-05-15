
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
    code: string;
    color?: string;
  };
  dueDate: Date;
  type: "assignment" | "quiz" | "exam" | "project";
}

const UpcomingTasksCard: React.FC = () => {
  // Mock upcoming tasks
  const upcomingTasks: Task[] = [
    {
      id: "task1",
      title: "Linear Regression Assignment",
      course: {
        id: "course1",
        title: "Introduction to Machine Learning",
        code: "CS-301",
        color: "#2563eb",
      },
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      type: "assignment",
    },
    {
      id: "task2",
      title: "Midterm Exam",
      course: {
        id: "course2",
        title: "Data Structures and Algorithms",
        code: "CS-202",
        color: "#0d9488",
      },
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: "exam",
    },
    {
      id: "task3",
      title: "Research Project Proposal",
      course: {
        id: "course3",
        title: "Advanced Artificial Intelligence",
        code: "CS-401",
        color: "#9333ea",
      },
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: "project",
    },
  ];

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

  // Task type badge style
  const getTaskTypeBadge = (type: Task["type"]) => {
    const styles = {
      assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      quiz: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      exam: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      project: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
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
        {upcomingTasks.length > 0 ? (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div 
                  className="w-1.5 h-12 rounded mr-3"
                  style={{ backgroundColor: task.course.color }}
                ></div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {getTaskTypeBadge(task.type)}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {task.course.code} • {task.course.title}
                    </span>
                    
                    <div className="flex items-center text-xs">
                      <Clock size={12} className="mr-1" />
                      <span className="text-muted-foreground">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming tasks for now!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasksCard;

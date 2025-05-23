
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Clock, CheckCircle } from "lucide-react";

interface QuickStatsProps {
  courseId: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ courseId }) => {
  // Mock data - in real app this would come from API/localStorage
  const stats = {
    lecturesCompleted: 8,
    totalLectures: 12,
    assignmentsPending: 3,
    averageScore: 87,
    studyTime: "24h 15m"
  };

  const completionRate = Math.round((stats.lecturesCompleted / stats.totalLectures) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lecturesCompleted}/{stats.totalLectures}</p>
              <p className="text-sm text-muted-foreground">Lectures</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.assignmentsPending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.studyTime}</p>
              <p className="text-sm text-muted-foreground">Study Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;

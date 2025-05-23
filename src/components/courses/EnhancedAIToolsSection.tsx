
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Zap, BookOpen, FileQuestion } from "lucide-react";
import AIStudyTool from "@/components/ai/AIStudyTool";

interface EnhancedAIToolsSectionProps {
  courseId: string;
}

const EnhancedAIToolsSection: React.FC<EnhancedAIToolsSectionProps> = ({ courseId }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const quickTools = [
    {
      id: "summarizer",
      name: "Quick Summarizer",
      description: "Instantly summarize lecture notes",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      id: "flashcards",
      name: "Flashcard Generator",
      description: "Create study cards from content",
      icon: Zap,
      color: "bg-purple-500"
    },
    {
      id: "quiz",
      name: "Quiz Creator",
      description: "Generate practice questions",
      icon: FileQuestion,
      color: "bg-green-500"
    },
    {
      id: "concepts",
      name: "Key Concepts",
      description: "Extract important topics",
      icon: BookOpen,
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    { action: "Generated flashcards", file: "Chapter_5_Notes.pdf", time: "2 hours ago" },
    { action: "Created summary", file: "Lecture_10.docx", time: "1 day ago" },
    { action: "Generated quiz", file: "Study_Guide.txt", time: "3 days ago" }
  ];

  if (selectedTool) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Study Tools</h3>
          <Button variant="outline" onClick={() => setSelectedTool(null)}>
            Back to Tools
          </Button>
        </div>
        <AIStudyTool />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick AI Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickTools.map((tool) => (
            <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
                    <tool.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedTool(tool.id)}
                      className="w-full"
                    >
                      Try Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Brain size={18} />
              Recent AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.file}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAIToolsSection;

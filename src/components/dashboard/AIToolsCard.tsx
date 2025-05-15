
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, File, Star } from "lucide-react";

const AIToolsCard: React.FC = () => {
  const aiTools = [
    {
      id: "summarize",
      title: "AI Document Summarizer",
      description: "Upload lecture notes or textbook chapters to generate concise summaries",
      icon: <File size={20} />,
      color: "bg-edu-primary/10 text-edu-primary",
    },
    {
      id: "flashcards",
      title: "Flashcard Generator",
      description: "Create study flashcards from your course materials automatically",
      icon: <Star size={20} />,
      color: "bg-edu-secondary/10 text-edu-secondary",
    },
    {
      id: "search",
      title: "Smart Course Search",
      description: "AI-powered search across all your course materials and notes",
      icon: <Search size={20} />,
      color: "bg-edu-accent/10 text-edu-accent",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="ai-gradient-text">AI Study Tools</span>
        </CardTitle>
        <CardDescription>
          Tools powered by artificial intelligence to enhance your learning
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((tool) => (
            <Card key={tool.id} className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col h-full">
                <div className={`${tool.color} p-2 rounded-md w-fit mb-3`}>
                  {tool.icon}
                </div>
                
                <h3 className="font-medium text-sm mb-2">{tool.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-grow">
                  {tool.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto text-xs"
                >
                  Use Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIToolsCard;


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, File, Star, BookOpen, Brain, FileQuestion, Key } from "lucide-react";

const AIToolsCard: React.FC = () => {
  const aiTools = [
    {
      id: "summarize",
      title: "AI Document Summarizer",
      description: "Generate concise summaries from lecture notes or readings",
      icon: <BookOpen size={20} />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "flashcards",
      title: "Flashcard Generator",
      description: "Create study flashcards automatically from your materials",
      icon: <Star size={20} />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "mcq",
      title: "Quiz Generator",
      description: "Create practice questions based on your course content",
      icon: <FileQuestion size={20} />,
      color: "from-green-500 to-emerald-400",
    },
    {
      id: "concepts",
      title: "Key Concepts Extractor",
      description: "Identify and explain the most important concepts",
      icon: <Key size={20} />,
      color: "from-orange-500 to-amber-400",
    },
    {
      id: "search",
      title: "Smart Course Search",
      description: "AI-powered search across all your course materials",
      icon: <Search size={20} />,
      color: "from-pink-500 to-rose-400",
    },
    {
      id: "explain",
      title: "Complex Topic Explainer",
      description: "Get simple explanations for difficult course concepts",
      icon: <Brain size={20} />,
      color: "from-teal-500 to-green-400",
    },
  ];

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-edu-primary/90 to-edu-secondary/80 text-white">
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain size={20} />
          <span>AI Study Tools</span>
        </CardTitle>
        <CardDescription className="text-white/80">
          Enhance your learning with AI-powered tools
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="border hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
              <CardContent className="p-4 flex flex-col h-full">
                <div className={`bg-gradient-to-r ${tool.color} p-2 rounded-md w-fit mb-3 text-white`}>
                  {tool.icon}
                </div>
                
                <h3 className="font-medium text-sm mb-2">{tool.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-grow">
                  {tool.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto text-xs hover:bg-gradient-to-r hover:from-edu-primary/10 hover:to-edu-secondary/10 transition-all duration-300"
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

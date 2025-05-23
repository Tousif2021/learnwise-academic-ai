
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  text: string;
  author: string;
  category: "motivation" | "study" | "success";
}

const motivationalQuotes: Quote[] = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "study"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "study"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "success"
  },
  {
    text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    author: "Richard Feynman",
    category: "study"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    category: "study"
  }
];

const studyTips = [
  "Take a 10-minute break every hour to maintain focus and productivity.",
  "Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Create a dedicated study space free from distractions.",
  "Review your notes within 24 hours to improve retention by 60%.",
  "Try explaining concepts out loud - teaching helps you learn better.",
  "Get 7-9 hours of sleep for optimal memory consolidation.",
  "Use active recall instead of just re-reading your notes.",
  "Break large tasks into smaller, manageable chunks."
];

const MotivationalQuotesCard: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentTip, setCurrentTip] = useState<string>("");
  const [showTip, setShowTip] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    return studyTips[randomIndex];
  };

  const refreshContent = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setCurrentTip(getRandomTip());
      setShowTip(!showTip);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
    setCurrentTip(getRandomTip());
  }, []);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb size={16} className="text-yellow-500" />
            {showTip ? "Study Tip" : "Daily Motivation"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 hover:bg-primary/10 transition-all duration-300 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            onClick={refreshContent}
          >
            <RefreshCw size={12} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {showTip ? (
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground leading-relaxed">
              💡 {currentTip}
            </p>
          </div>
        ) : (
          currentQuote && (
            <div className="animate-fade-in">
              <blockquote className="text-sm leading-relaxed mb-2 italic">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-xs text-muted-foreground">
                — {currentQuote.author}
              </cite>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationalQuotesCard;

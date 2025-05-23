
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MotivationalWidget: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const studyTips = [
    "Break your study sessions into 25-minute focused blocks with 5-minute breaks.",
    "Teach what you've learned to someone else - it's the best way to reinforce knowledge.",
    "Use active recall instead of just re-reading notes - quiz yourself regularly.",
    "Study in different locations to strengthen memory formation.",
    "Connect new information to what you already know for better retention.",
    "Take handwritten notes - research shows it improves comprehension.",
    "Review material within 24 hours to move it to long-term memory."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % studyTips.length);
    }, 30000); // Change tip every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % studyTips.length);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-2">Study Tip</h4>
            <p className="text-sm text-blue-800 mb-3">{studyTips[currentTip]}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextTip}
              className="text-blue-700 hover:text-blue-900 p-0 h-auto"
            >
              <RefreshCw size={14} className="mr-1" />
              Next tip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalWidget;

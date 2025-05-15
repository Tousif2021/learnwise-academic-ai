
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface MCQProps {
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

interface MCQsContentProps {
  mcqs: MCQProps[];
}

const MCQsContent: React.FC<MCQsContentProps> = ({ mcqs }) => {
  return (
    <Tabs defaultValue="mcqs">
      <TabsContent value="mcqs">
        <div className="space-y-4">
          {mcqs?.map((mcq, index) => (
            <Card key={index} className="p-4">
              <h4 className="font-medium mb-2">Question {index + 1}</h4>
              <p className="text-sm mb-3">{mcq.question}</p>
              
              <div className="space-y-2 mb-3">
                {mcq.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`border p-2 rounded-md text-sm flex items-center ${
                      mcq.correctOption === optIndex 
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : ""
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center border rounded-full mr-2">
                      <span className="text-xs">{String.fromCharCode(65 + optIndex)}</span>
                    </div>
                    {option}
                  </div>
                ))}
              </div>
              
              {mcq.explanation && (
                <div className="bg-muted p-3 rounded-md">
                  <h5 className="text-xs font-medium mb-1">Explanation:</h5>
                  <p className="text-xs">{mcq.explanation}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MCQsContent;

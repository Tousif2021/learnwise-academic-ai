
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
  question: string;
  answer: string;
}

interface FlashcardsContentProps {
  flashcards: FlashcardProps[];
}

const FlashcardsContent: React.FC<FlashcardsContentProps> = ({ flashcards }) => {
  return (
    <Tabs defaultValue="flashcards">
      <TabsContent value="flashcards">
        <div className="space-y-3">
          {flashcards?.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="cursor-pointer h-full">
                <div className="bg-muted p-3">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <p className="text-sm">{card.question}</p>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">Answer:</h4>
                  <p className="text-sm">{card.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FlashcardsContent;

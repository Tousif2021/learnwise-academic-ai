
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface ConceptProps {
  concept: string;
  description: string;
}

interface ConceptsContentProps {
  concepts: ConceptProps[];
}

const ConceptsContent: React.FC<ConceptsContentProps> = ({ concepts }) => {
  return (
    <TabsContent value="concepts">
      <div className="space-y-3">
        {concepts?.map((concept, index) => (
          <Card key={index} className="p-4">
            <h4 className="font-medium mb-1">{concept.concept}</h4>
            <p className="text-sm">{concept.description}</p>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
};

export default ConceptsContent;

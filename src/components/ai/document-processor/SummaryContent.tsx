
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface SummaryContentProps {
  summary: string;
}

const SummaryContent: React.FC<SummaryContentProps> = ({ summary }) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-2">Document Summary</h3>
      <p className="text-sm whitespace-pre-line">{summary}</p>
    </div>
  );
};

export default SummaryContent;

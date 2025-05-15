
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ToolOption } from "./types";
import { useToast } from "@/hooks/use-toast";

interface ToolSelectionProps {
  file: File;
  tools: ToolOption[];
  isProcessing: boolean;
  onSelectTool: (toolType: string) => void;
  resetAll: () => void;
}

const ToolSelection: React.FC<ToolSelectionProps> = ({ 
  file, 
  tools, 
  isProcessing, 
  onSelectTool, 
  resetAll 
}) => {
  return (
    <div>
      <div className="mb-4 bg-muted/50 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center">
          <FileText size={18} className="mr-2 text-edu-primary" />
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {`${(file.size / 1024 / 1024).toFixed(2)} MB • ${file.type || "Unknown type"}`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetAll}>
          Change File
        </Button>
      </div>

      <h3 className="text-lg font-medium mb-4">Select a Tool</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant="outline"
            className="h-auto p-4 justify-start gap-3"
            disabled={isProcessing}
            onClick={() => onSelectTool(tool.id)}
          >
            <tool.icon className="h-5 w-5 text-edu-primary" />
            <div className="text-left">
              <div className="font-medium">{tool.name}</div>
              <div className="text-xs text-muted-foreground">{tool.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToolSelection;

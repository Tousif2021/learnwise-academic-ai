import { summarizeDocument } from "./OpenAI";
// ... other imports

const processTool = async (toolType: ToolType) => {
  if (!file) {
    toast({
      title: "No file selected",
      description: "Please upload a file first.",
      variant: "destructive",
    });
    return;
  }

  setIsProcessing(true);
  setSelectedTool(toolType);

  try {
    const fileContent = await extractFileContent(file);
    const processingTime = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    const newContent = generateContent(toolType, fileContent, file.name);

    // --- Use OpenAI for summary ---
    if (toolType === "summary") {
      newContent.summary = await summarizeDocument(fileContent);
    }

    setAiContent(newContent);

    toast({
      title: "Processing complete",
      description: `Your file has been processed using the ${toolType} tool.`,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    toast({
      title: "Processing failed",
      description: "There was an error processing your document.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};

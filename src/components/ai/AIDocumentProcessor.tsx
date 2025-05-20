import { summarizeDocument, generateFlashcards, generateMCQs } from "./OpenAI";
// ... (other imports)

const handleProcess = async () => {
  if (!file) return;

  setIsProcessing(true);

  try {
    const startTime = Date.now();
    const fileContent = await extractFileContent(file);

    // Use OpenAI for summary
    const summary = await summarizeDocument(fileContent);

    // Get AI-generated flashcards and MCQs
    const flashcards = await generateFlashcards(fileContent);
    const mcqs = await generateMCQs(fileContent);
    
    // Generate key concepts from summary
    const keyConcepts = generateKeyConcepts(summary, file.name);

    const newAiContent = {
      id: `ai-content-${Date.now()}`,
      courseContentId: `content-${Date.now()}`,
      summary,
      flashcards,
      mcqs,
      keyConcepts,
      generatedAt: new Date()
    };

    setAiContent(newAiContent);

    toast({
      title: "Processing complete",
      description: "Your document has been processed successfully.",
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

// Helper function to extract key concepts (used until we implement AI-generated ones)
const generateKeyConcepts = (summaryText: string, fileName: string) => {
  const lines = summaryText.split('.');
  return lines
    .filter(line => line.trim().length > 20)
    .slice(0, 5)
    .map(line => ({
      concept: line.trim(),
      details: `Detail for ${line.trim().substring(0, 30)}...`
    }));
};

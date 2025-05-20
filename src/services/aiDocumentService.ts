
import { supabase, getServerTimestamp } from '@/lib/supabase';
import type { DocumentInsert, AIResultInsert } from '@/types/supabase';
import { OpenAI } from 'openai';

// Configure OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Upload a document to Supabase storage and register in the database
 * @param file - File to upload
 * @param studentId - ID of the student uploading the file
 * @param courseId - Optional course ID the document belongs to
 * @param category - Optional document category
 */
export const uploadDocument = async (
  file: File,
  studentId: string,
  courseId?: string,
  category?: string
) => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${studentId}/${Date.now()}-${file.name}`;
    
    // Upload file to Supabase Storage
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Register document in the database
    const documentInsert: DocumentInsert = {
      name: file.name,
      type: fileExt || 'unknown',
      size: file.size,
      url: publicUrlData.publicUrl,
      student_id: studentId,
      course_id: courseId,
      category,
      processed: false
    };
    
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert(documentInsert)
      .select()
      .single();
    
    if (documentError) {
      throw new Error(`Error registering document: ${documentError.message}`);
    }
    
    return {
      success: true,
      data: documentData
    };
  } catch (error) {
    console.error('Document upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Extract content from a document file
 * @param file - File to extract content from
 */
export const extractFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        resolve(e.target?.result as string);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // In a real implementation, we'd use a PDF parsing library
        // For now, we'll return a placeholder for demo purposes
        resolve(`Content extracted from PDF: ${file.name}`);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.endsWith('.docx')
      ) {
        // In a real implementation, we'd use a DOCX parsing library
        resolve(`Content extracted from DOCX: ${file.name}`);
      } else {
        reject(new Error('Unsupported file type'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // Mock reading other file types
      setTimeout(() => {
        reader.onload({ target: { result: "" } } as any);
      }, 500);
    }
  });
};

/**
 * Process a document with AI and store the results
 * @param documentId - ID of the document to process
 * @param content - Content extracted from the document
 */
export const processDocumentWithAI = async (documentId: string, content: string) => {
  try {
    // Process with OpenAI
    const [summaryResponse, flashcardsResponse, mcqsResponse] = await Promise.all([
      // Get summary
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: `Summarize the following document in detail:\n${content}` }],
        temperature: 0.3,
      }),
      
      // Get flashcards
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: `Generate 5 comprehensive flashcards from the following content. Return as JSON array with "question" and "answer" fields:\n${content}`
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
      
      // Get MCQs
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: `Generate 3 multiple choice questions from the following content. Return as JSON array with fields: "question", "options" (array), "correctOption" (index), and "explanation":\n${content}`
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      })
    ]);
    
    // Parse responses
    const summary = summaryResponse.choices[0].message.content;
    
    let flashcards = [];
    try {
      const flashcardsText = flashcardsResponse.choices[0].message.content;
      if (flashcardsText) {
        const parsed = JSON.parse(flashcardsText);
        flashcards = parsed.flashcards || parsed;
      }
    } catch (e) {
      console.error('Error parsing flashcards:', e);
    }
    
    let mcqs = [];
    try {
      const mcqsText = mcqsResponse.choices[0].message.content;
      if (mcqsText) {
        const parsed = JSON.parse(mcqsText);
        mcqs = parsed.questions || parsed;
      }
    } catch (e) {
      console.error('Error parsing MCQs:', e);
    }
    
    // Generate key concepts
    const concepts = await generateKeyConcepts(content);
    
    // Store results in database
    const aiResult: AIResultInsert = {
      document_id: documentId,
      summary,
      flashcards,
      mcqs,
      key_concepts: concepts,
      raw_content: content,
      model_used: 'gpt-4o'
    };
    
    const { data, error } = await supabase
      .from('ai_results')
      .insert(aiResult)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error storing AI results: ${error.message}`);
    }
    
    // Mark document as processed
    await supabase
      .from('documents')
      .update({ processed: true })
      .eq('id', documentId);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('AI processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate key concepts from document content
 * @param content - Document content
 */
const generateKeyConcepts = async (content: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Extract 5 key concepts from the following content. Return as JSON array with fields "concept" and "description":\n${content}`
      }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    const conceptsText = response.choices[0].message.content;
    if (conceptsText) {
      const parsed = JSON.parse(conceptsText);
      return parsed.concepts || parsed;
    }
    
    return [];
  } catch (e) {
    console.error('Error generating key concepts:', e);
    return [];
  }
};

/**
 * Ask a question about a document
 * @param documentId - ID of the document to query
 * @param question - User's question
 */
export const askDocumentQuestion = async (documentId: string, question: string) => {
  try {
    // Get the document content and AI results
    const { data: aiResult, error: aiError } = await supabase
      .from('ai_results')
      .select('*')
      .eq('document_id', documentId)
      .single();
    
    if (aiError) {
      throw new Error(`Error fetching AI results: ${aiError.message}`);
    }
    
    // Prepare context from AI results
    const context = `
Document Summary: ${aiResult.summary}

Key Concepts:
${JSON.stringify(aiResult.key_concepts)}

Raw Content:
${aiResult.raw_content.slice(0, 2000)}...
`;
    
    // Query OpenAI with the context and question
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an educational assistant helping with document questions. Answer precisely based on the document content. If the answer is not in the document, say so clearly.'
        },
        {
          role: 'user',
          content: `Context about the document:\n${context}\n\nUser question: ${question}`
        }
      ],
      temperature: 0.3,
    });
    
    const answer = response.choices[0].message.content;
    
    return {
      success: true,
      data: {
        question,
        answer,
        documentId
      }
    };
  } catch (error) {
    console.error('Failed to answer question:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

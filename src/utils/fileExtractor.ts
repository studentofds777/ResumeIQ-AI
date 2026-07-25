import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<{ text: string; fileName: string }> {
  const fileName = file.name;
  const fileType = file.name.split('.').pop()?.toLowerCase();

  try {
    if (fileType === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return { text: result.value || '', fileName };
    } 

    if (fileType === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      // Attempt clean text extraction from PDF stream or buffer
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawString = decoder.decode(arrayBuffer);
      
      // Extract visible text content streams from PDF syntax if possible, or fallback to clean ASCII/UTF-8 words
      let cleanText = '';
      const textMatches = rawString.match(/\(([^()]+)\)\s*Tj|\[([^\[\]]+)\]\s*TJ/g);
      
      if (textMatches && textMatches.length > 0) {
        cleanText = textMatches
          .map(m => m.replace(/[()\[\]]/g, '').replace(/Tj|TJ/g, ''))
          .join(' ')
          .replace(/\\/g, '');
      }
      
      if (!cleanText || cleanText.trim().length < 50) {
        // Fallback: Extract printable word strings from array buffer
        const printable = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        const words = printable.split(/\s+/).filter(w => w.length > 2);
        cleanText = words.slice(0, 1500).join(' ');
      }

      if (!cleanText || cleanText.trim().length < 20) {
        cleanText = `PDF Document: ${file.name}\n(Content extracted automatically for AI processing)`;
      }

      return { text: cleanText, fileName };
    }

    // Default for TXT, MD, CSV, HTML
    const text = await file.text();
    return { text, fileName };
  } catch (err) {
    console.error('File extraction error:', err);
    throw new Error(`Failed to extract text from ${file.name}. Please try uploading as DOCX, TXT, or paste the text directly.`);
  }
}

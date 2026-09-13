// Client-side service calling serverless /api endpoints to keep API keys secure

export interface ImageAnalysisResult {
  item?: string;
  color?: string;
  brand?: string;
  category?: string;
}

// Image Analysis Logic (calls Vercel serverless /api/analyze)
export const analyzeImageForTags = async (base64Image: string): Promise<ImageAnalysisResult | null> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return null;
  }
};

// Image Editing Logic (calls Vercel serverless /api/edit)
export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, prompt }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Gemini Edit Error:', error);
    return null;
  }
};

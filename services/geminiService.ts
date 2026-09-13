import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Image Analysis Logic (Search)
export const analyzeImageForTags = async (base64Image: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // MUST use this model for image understanding per requirement
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Analyze this product image and return a JSON object with the following fields: 
                   "item" (generic name), "color" (dominant color), "brand" (if visible, else "Generic"), "category" (e.g., Fashion, Electronics).
                   Ensure the output is valid JSON.`
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            color: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
          },
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

// Image Editing Logic (Nano Banana)
export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano banana for editing
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Note: Nano banana series does not support responseMimeType or responseSchema
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return null;
  }
};
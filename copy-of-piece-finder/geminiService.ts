import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image of clothing and searches for it on the web using Search Grounding.
 */
export const findClothingForSale = async (base64Image: string): Promise<SearchResult> => {
  try {
    const cleanBase64 = base64Image.split(',')[1]; // Remove data URL prefix if present

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, but works for PNG too
              data: cleanBase64
            }
          },
          {
            text: `Analyze this image of clothing. Identify the item specifically (brand, model, style, color, material).
            
            Then, use Google Search to find where this specific item (or the closest possible match) is available for sale online.
            
            In your text response:
            1. Give a brief, stylish description of the item.
            2. Mention the estimated price range if found.
            3. Provide a short list of potential retailers found.
            
            Do not return JSON. Write in a clean, helpful tone.`
          }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType cannot be JSON when using googleSearch
      }
    });

    const text = response.text || "No description available.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      description: text,
      groundingChunks: chunks as GroundingChunk[],
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
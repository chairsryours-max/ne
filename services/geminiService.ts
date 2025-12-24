
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice } from "../types";

export const getEventAdvice = async (description: string, guestCount: number, location: string): Promise<AIAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this event and provide professional rental advice:
      - Event: ${description}
      - Guests: ${guestCount}
      - Location: ${location}
      
      Focus on furniture and equipment needs for a high-end experience in North Carolina.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific equipment recommendations (chairs, tables, etc.)"
          },
          layoutStrategy: {
            type: Type.STRING,
            description: "Expert advice on seating layout and flow"
          },
          suggestedAddons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Extra items like lighting, heaters, or decor"
          },
          proTip: {
            type: Type.STRING,
            description: "A professional insider tip for this specific type of event"
          }
        },
        required: ["recommendations", "layoutStrategy", "suggestedAddons", "proTip"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AIAdvice;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Could not generate AI advice.");
  }
};

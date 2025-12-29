
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generatePostImage = async (prompt: string, aspectRatio: string = "1:1") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality Instagram post image about: ${prompt}. Professional aesthetics, cinematic lighting.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        }
      },
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
};

export const generatePostContent = async (topic: string, tone: string): Promise<GeneratedContent> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Crie uma legenda de Instagram profissional sobre o tópico: "${topic}". 
      O tom deve ser: ${tone}. 
      Inclua 5 hashtags relevantes e 3 sugestões de elementos visuais para o post. 
      Responda em JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["caption", "hashtags", "suggestions"]
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return {
      caption: "Erro ao gerar legenda. Tente novamente.",
      hashtags: [],
      suggestions: []
    };
  }
};

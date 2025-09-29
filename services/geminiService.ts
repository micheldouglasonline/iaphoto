
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { EditImageResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<EditImageResult> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        let imageData: string | null = null;
        let imageMimeType: string | null = null;
        let text: string | null = null;
        
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    text = part.text;
                } else if (part.inlineData) {
                    imageData = part.inlineData.data;
                    imageMimeType = part.inlineData.mimeType;
                }
            }
        }

        return { imageData: imageData, mimeType: imageMimeType, text: text };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to edit image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while editing the image.");
    }
}

import { GoogleGenAI } from "@google/genai";

// Initialization of the Google GenAI client.
// The API key is obtained exclusively from the environment variable process.env.API_KEY.
// This allows the app to be connected to the Gemini API for future AI features 
// (e.g., smart scheduling, content generation).
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

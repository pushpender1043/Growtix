import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize using the Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY_MENTOR;
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (message: string, history: any[], style: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert AI Coding Mentor on a platform called CodeAstra. The user prefers explanations in a ${style} format. Do NOT give them the direct final answer immediately. Guide them, give hints, explain errors, and use markdown code blocks.`
    });

    // Format history for Gemini
    const formattedHistory = history
      // We skip the very first welcome message so it doesn't confuse the AI
      .filter((msg) => msg.id !== 1) 
      .map((msg) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  }  catch (error) {
    console.error("Error fetching Gemini response:", error);
    
    // This will show up in your chat UI as a normal AI message, preventing a crash!
    return "I'm currently experiencing high server traffic. Could you please wait a few seconds and try sending that again?";
  }
};

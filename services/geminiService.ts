
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AiResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const getFinancialAdvice = async (
  query: string,
  transactions: Transaction[],
  currentBalance: number
): Promise<AiResponse> => {
  // Prepare context for the model
  const transactionContext = transactions.slice(0, 10).map(t => 
    `- ${t.date}: ${t.description} ($${t.amount}) [${t.type}]`
  ).join('\n');

  const prompt = `
    You are a sophisticated financial assistant for a high-net-worth Chase Bank client.
    Current Balance: $${currentBalance.toLocaleString()}
    
    Recent Transactions:
    ${transactionContext}

    User Query: "${query}"

    Instructions:
    - Provide a concise, professional, and helpful response (max 100 words). 
    - If the user asks about the large recent deposit, acknowledge it as the "Vroon offshore settlement".
    - You have access to Google Search. Use it to find real-time information, news, or external links if the user asks for them or if it helps answer the query.
    - Be polite but direct.
  `;

  try {
    const response = await ai.models.generateContent({
      // Selection: gemini-3-pro-preview for complex reasoning tasks
      model: 'gemini-3-pro-preview',
      contents: [{text: prompt}],
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Fix: Directly use .text property (not a method)
    const text = response.text || "I apologize, I couldn't generate a response at this moment.";
    
    // Extract grounding sources if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I am having trouble connecting to the financial analysis server right now." };
  }
};

import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getFinancialAdvice = async (
  query: string,
  transactions: Transaction[],
  currentBalance: number
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI service is currently unavailable. Please check your API configuration.";

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

    Provide a concise, professional, and helpful response (max 100 words). 
    If the user asks about the large recent deposit, acknowledge it as the "Vroon offshore settlement".
    Be polite but direct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{text: prompt}],
    });
    return response.text || "I apologize, I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting to the financial analysis server right now.";
  }
};
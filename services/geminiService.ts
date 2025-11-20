import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Note: In a real production app, handle missing API keys gracefully. 
// We assume the environment provides it for this demo.

const ai = new GoogleGenAI({ apiKey });

export const generateMarketingMessage = async (customerName: string, panel: string, price: number): Promise<string> => {
  if (!apiKey) return "Erro: API Key não configurada.";

  try {
    const prompt = `
      A empresa se chama "MeloTV" (Streaming).
      Crie uma mensagem curta, amigável e persuasiva para o WhatsApp.
      O objetivo é lembrar o cliente ${customerName} sobre a renovação do plano ${panel}.
      O valor é R$ ${price.toFixed(2)}.
      Inclua emojis relevantes de TV/Filmes.
      Não coloque assunto, apenas o corpo da mensagem.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Erro ao conectar com a IA da MeloTV.";
  }
};
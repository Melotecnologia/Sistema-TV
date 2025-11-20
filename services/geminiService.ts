import { GoogleGenAI } from "@google/genai";

// Safe access to process.env to prevent "process is not defined" crashes in browser
const getApiKey = () => {
  try {
    // @ts-ignore - process.env is injected by Vite config
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("Environment variable access failed");
    return '';
  }
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateMarketingMessage = async (customerName: string, panel: string, price: number): Promise<string> => {
  if (!ai || !apiKey) {
    console.warn("AI Service: Missing API Key");
    return "Erro: Chave de API não configurada no Vercel (Environment Variables).";
  }

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
    return "Erro ao conectar com a IA. Verifique a API Key.";
  }
};

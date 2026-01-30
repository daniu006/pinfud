import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    private readonly model = 'llama-3.3-70b-versatile';

    constructor() { }

    async generateResponse(prompt: string, context: string = ''): Promise<string> {
        const apiKey = environment.groqApiKey;

        if (!apiKey || apiKey === 'TU_GROQ_API_KEY_AQUI') {
            return 'Por favor, configura tu API Key de Groq en el archivo environment.ts.';
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: `Eres un asistente experto en comida ecuatoriana para la aplicación Pinfud. 
                            Responde de manera amable, corta y útil. 
                            Contexto actual de la app: ${context}`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_completion_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Groq API Error:', errorData);
                return `Error de la IA (Groq ${response.status}): ${errorData.error?.message || 'No se pudo procesar.'}`;
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || 'Recibí una respuesta vacía del asistente.';
        } catch (error) {
            console.error('Error calling Groq API:', error);
            return 'Hubo un error al conectar con mi cerebro (Groq). Por favor, intenta de nuevo.';
        }
    }
}

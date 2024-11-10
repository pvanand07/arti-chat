import { v4 as uuidv4 } from 'uuid';

class LLMClient {
    constructor() {
        this.apiUrl = 'https://audio-api.elevatics.cloud/llm-agent';
        this.apiKey = '44d5c2ac18ced6fc25c1e57dcd06fc0b31fb4ad97bf56e67540671a647465df4';
        this._modelId = 'openai/gpt-4o-mini';
        this.conversationId = uuidv4();
    }

    get modelId() {
        return this._modelId;
    }

    set modelId(value) {
        this._modelId = value;
    }

    async *streamResponse(prompt, systemMessage) {
        console.log('Streaming response for model:', this._modelId);
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    system_message: systemMessage,
                    model_id: this._modelId,
                    conversation_id: this.conversationId,
                    user_id: 'default'
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                yield chunk;
            }
        } catch (error) {
            console.log("Error in sending request to LLM API:", JSON.stringify({
                prompt,
                system_message: systemMessage,
                model_id: this._modelId,
                conversation_id: this.conversationId,
                user_id: 'default'
            }));
            throw new Error('Failed to communicate with LLM API: ' + error.message);
            
        }
    }
}

export { LLMClient }; 
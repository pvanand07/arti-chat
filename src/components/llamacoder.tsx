import React, { useState, useRef } from 'react';
import { LLMClient } from '../api/llm-client';
import { SandpackPreviewRef } from '@codesandbox/sandpack-react/unstyled';
import { ArtifactPreview } from './Artifacts/ArtifactPreview';

const LlamaCoder = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const previewRef = useRef<SandpackPreviewRef | null>(null);

  // Initialize LLM client
  const llmClient = new LLMClient();

  // Function to generate code using LLM Client
  const createApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedCode('');

    const systemMessage = `You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully:
      - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
      - Make sure the React app is interactive and functional by creating state when needed and having no required props
      - If you use any imports from React like useState or useEffect, make sure to import them directly
      - Use TypeScript as the language for the React component
      - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
      - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
      - Please ONLY return the full React code starting with the imports, nothing else.
      NO LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.`;

    try {
      let fullResponse = '';
      for await (const chunk of llmClient.streamResponse(prompt, systemMessage)) {
        fullResponse += chunk;
        setGeneratedCode(fullResponse);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const artifact = {
    type: 'react',
    language: 'typescript',
    content: generatedCode || undefined,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">LlamaCoder</h1>
        
        <form onSubmit={createApp} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Build me a calculator app..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-4">
            <p>Generating your application...</p>
          </div>
        )}

        {generatedCode && (
          <div className="border rounded-lg overflow-hidden">
            <ArtifactPreview 
              artifact={artifact}
              showEditor={true}
              previewRef={previewRef}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LlamaCoder;
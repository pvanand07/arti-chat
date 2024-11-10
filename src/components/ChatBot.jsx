import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ArtifactDisplay from './ArtifactDisplay';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import prompts from '../assets/prompts';
import { LLMClient } from '../api/llm-client';
import models from '../assets/llm-ids-openrouter';

const formatModelName = (fullName) => {
  return fullName.split('/')[1] || fullName;
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [artifact, setArtifact] = useState(null);
  const scrollAreaRef = useRef(null);
  const llmClientRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [showModelPanel, setShowModelPanel] = useState(true);

  useEffect(() => {
    llmClientRef.current = new LLMClient();
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setShowModelPanel(scrollTop < 50);
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleModelChange = (value) => {
    setSelectedModel(value);
    if (llmClientRef.current) {
      llmClientRef.current.modelId = value;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);

    try {
      setCurrentStreamingMessage('');
      const systemMessage = prompts["artifact-system"].content;
      let fullResponse = '';
      
      for await (const chunk of llmClientRef.current.streamResponse(userMessage, systemMessage)) {
        fullResponse += chunk;
        setCurrentStreamingMessage(fullResponse);

        const artifactMatch = fullResponse.match(/:::artifact{identifier="(.+?)" type="(.+?)" title="(.+?)"}\n\`\`\`(.+?)\n\`\`\`\n:::/s);
        if (artifactMatch) {
          setArtifact({
            title: artifactMatch[3],
            type: artifactMatch[2],
            content: artifactMatch[4]
          });
        }
      }
      
      setMessages(prev => [...prev, { text: fullResponse, isBot: true }]);
      setCurrentStreamingMessage('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I encountered an error. Please try again.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full flex overflow-hidden">
      <div className={`flex flex-col ${artifact ? 'w-2/3' : 'w-full'} transition-all duration-300 relative min-w-0 overflow-hidden`}>
        <div 
          className={`absolute inset-x-0 top-0 z-20 transition-transform duration-300 ${
            showModelPanel ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue>
                    {selectedModel && (
                      <div className="flex items-center w-full">
                        <span className="truncate mr-8">
                          {formatModelName(selectedModel)}
                        </span>
                        {models.find(m => m.name === selectedModel)?.score && (
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            Quality: {models.find(m => m.name === selectedModel)?.score}
                          </span>
                        )}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      <div className="flex items-center w-full min-w-0">
                        <span className="truncate" style={{ minWidth: '200px' }}>
                          {formatModelName(model.name)}
                        </span>
                        {model.score && (
                          <span className="text-sm text-gray-500 ml-auto">
                            {model.score}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-gray-50 z-10" />
        
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full">
          <div className="pb-32 w-full overflow-hidden flex justify-center">
            <div className="w-full max-w-[800px]">
              <ChatMessages 
                messages={messages} 
                currentStreamingMessage={currentStreamingMessage} 
                containerWidth={artifact ? 'w-2/3' : 'w-full'}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-50 pt-10">
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-[800px]">
              <MessageInput 
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
              <div className="text-xs text-center mt-2 text-gray-500">
                Powered by GPT-4. Messages are processed through a secure API.
              </div>
            </div>
          </div>
        </div>
      </div>

      {artifact && (
        <div className="w-1/3 border-l border-gray-200 overflow-hidden">
          <ArtifactDisplay artifact={artifact} />
        </div>
      )}
    </div>
  );
};

export default ChatBot;
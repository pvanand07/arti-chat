import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

const ChatMessages = ({ messages, currentStreamingMessage, containerWidth }) => (
  <>
    {messages.map((message, index) => (
      <div
        key={index}
        className={`group w-full text-gray-800 dark:text-gray-100 
          ${message.isBot ? 'bg-white' : 'bg-gray-50'}`}
      >
        <div className="px-4 py-8 flex gap-6 max-w-full">
          {message.isBot ? (
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-blue-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-green-600 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className="prose dark:prose-invert flex-1 min-w-0 max-w-[calc(100%-2rem)]">
            <ReactMarkdown
              className="overflow-hidden"
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && language) {
                    return (
                      <div className="max-w-full overflow-x-auto">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="rounded-md"
                          customStyle={{ maxWidth: '100%' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
                pre: ({ children }) => (
                  <pre className="max-w-full overflow-x-auto">
                    {children}
                  </pre>
                )
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    ))}
    
    {/* Streaming message */}
    {currentStreamingMessage && (
      <div className="group w-full text-gray-800 dark:text-gray-100 bg-white ">
        <div className="px-4 py-8 flex gap-6 max-w-full">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="prose dark:prose-invert flex-1 min-w-0 max-w-[calc(100%-2rem)]">
            <ReactMarkdown
              className="overflow-hidden"
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  if (!inline && language) {
                    return (
                      <div className="max-w-full overflow-x-auto">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="rounded-md"
                          customStyle={{ maxWidth: '100%' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
                pre: ({ children }) => (
                  <pre className="max-w-full overflow-x-auto">
                    {children}
                  </pre>
                )
              }}
            >
              {currentStreamingMessage}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    )}
  </>
);

export default ChatMessages; 
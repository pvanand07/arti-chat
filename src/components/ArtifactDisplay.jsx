import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from '@/components/ui/scroll-area';
import ComponentBuilder from './react-renderer';

const ArtifactDisplay = ({ artifact }) => {
  if (!artifact) return null;

  // If the artifact is a React component, use the ComponentBuilder
  if (artifact.type === 'application/vnd.react') {
    // Trim any code identifiers (like ```jsx or ```javascript)
    console.log('artifact.content', artifact.content);
    const cleanCode = artifact.content.replace(/^```[\w-]*\n|^javascript/, '').replace(/\n```$/, '');
    console.log('cleanCode', cleanCode);
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold">{artifact.title}</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ComponentBuilder initialCode={cleanCode} />
        </div>
      </div>
    );
  }

  // Default markdown display for other artifact types
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold">{artifact.title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                if (!inline && language) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      className="rounded-md"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                }
                return <code className={className} {...props}>{children}</code>;
              }
            }}
          >
            {artifact.content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ArtifactDisplay; 
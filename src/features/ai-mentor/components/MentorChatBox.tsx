import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface MentorChatBoxProps {
  message: Message;
}

export const MentorChatBox: React.FC<MentorChatBoxProps> = ({ message }) => {
  const isAi = message.role === 'ai';

  return (
    <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] p-4 rounded-2xl border ${
        isAi 
          ? 'bg-muted/50 border-border text-foreground' 
          : 'bg-primary border-primary text-primary-foreground'
      }`}>
        
        {isAi ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="overflow-hidden rounded-md my-2">
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="px-1.5 py-0.5 bg-background/50 rounded-md text-sm font-mono text-primary" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};
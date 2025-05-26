import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MediaPlayer from './MediaPlayer';

const MarkdownContent = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Custom renderer for video and audio links
  const customRenderers = {
    // Code block with copy button
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      const index = Math.random().toString(36).substring(7);

      return !inline && match ? (
        <div className="relative group my-6">
          <button
            onClick={() => handleCopyCode(code, index)}
            className="absolute right-3 top-3 p-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 
              transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
            title="Copy code"
            aria-label="Copy code"
          >
            {copiedCode === index ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-300" />
            )}
          </button>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-xl shadow-lg overflow-hidden"
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              background: '#1e1e1e',
            }}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-900 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Handle video and audio links
    a({ node, href, children, ...props }) {
      // Check if the link is a video or audio file
      const isVideo = /\.(mp4|webm|ogg)$/i.test(href);
      const isAudio = /\.(mp3|wav|ogg)$/i.test(href);

      if (isVideo || isAudio) {
        return <MediaPlayer type={isVideo ? 'video' : 'audio'} url={href} title={children} />;
      }

      // Regular link with blue color
      return (
        <a
          href={href}
          {...props}
          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },

    // Responsive image
    img({ node, ...props }) {
      return (
        <img
          {...props}
          className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-full h-auto"
          loading="lazy"
          alt={props.alt || 'Image'}
        />
      );
    },

    // Responsive table
    table({ node, ...props }) {
      return (
        <div className="overflow-x-auto my-6">
          <table
            {...props}
            className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
          />
        </div>
      );
    },

    // Table header
    th({ node, ...props }) {
      return (
        <th
          {...props}
          className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
        />
      );
    },

    // Table cell
    td({ node, ...props }) {
      return <td {...props} className="px-6 py-4 text-sm text-gray-600 border-t border-gray-200" />;
    },

    // Custom heading styles
    h1({ node, ...props }) {
      return <h1 {...props} className="text-4xl font-bold text-gray-900 mt-8 mb-6" />;
    },
    h2({ node, ...props }) {
      return <h2 {...props} className="text-3xl font-bold text-gray-900 mt-6 mb-4" />;
    },
    h3({ node, ...props }) {
      return <h3 {...props} className="text-2xl font-bold text-gray-900 mt-4 mb-3" />;
    },
    h4({ node, ...props }) {
      return <h4 {...props} className="text-xl font-bold text-gray-900 mt-4 mb-3" />;
    },
  };

  return (
    <div
      className="prose prose-lg max-w-none 
        prose-headings:font-bold prose-headings:text-gray-900 
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 
        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 
        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-4 
        prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-4 
        prose-p:text-gray-700 
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
        prose-strong:text-gray-900 
        prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-gray-900 
        prose-pre:bg-gray-900 prose-pre:text-gray-100 
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:font-medium prose-blockquote:text-gray-600 
        prose-img:rounded-xl prose-img:shadow-md prose-img:transition-shadow prose-img:hover:shadow-lg"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customRenderers}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;

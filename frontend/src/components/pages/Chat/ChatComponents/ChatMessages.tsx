"use client";

import { useAppSelector } from "@/redux/app/hooks";
import { useState } from "react";
import { LuCheck, LuCopy, LuLoader } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Image from "next/image";

// Code Block Component
const CodeBlock = ({ language, code, onCopy, isCopied }: any) => {
  return (
    <div className="rounded-md overflow-hidden my-2">
      <div className="bg-[#252526] text-gray-200 px-4 py-3 text-xs flex justify-between items-center">
        <span>{language || "code"}</span>
        <button
          onClick={() => onCopy(code)}
          className="hover:text-white flex items-center gap-1 cursor-pointer"
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <LuCheck size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <LuCopy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        lineProps={() => ({
          style: {
            display: "block",
            backgroundColor: "transparent",
          },
        })}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// UserMessage Component
const UserMessage = ({ content }: any) => {
  return (
    <div className="bg-[#acb7ff] ml-auto text-black w-fit py-2 px-4 rounded-2xl">
      {content}
    </div>
  );
};

// AssistantMessage Component
const AssistantMessage = ({ content, isLoading, copiedCode, onCopy }: any) => {
  const MarkdownComponents = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeContent = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <CodeBlock
          language={match[1]}
          code={codeContent}
          onCopy={onCopy}
          isCopied={copiedCode === codeContent}
        />
      ) : (
        <code
          className={`${className} bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded`}
          {...props}
        >
          {children}
        </code>
      );
    },
    table({ children, ...props }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table
            className="min-w-full divide-y divide-gray-300 border border-gray-300"
            {...props}
          >
            {children}
          </table>
        </div>
      );
    },
    th({ children, ...props }: any) {
      return (
        <th
          className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100"
          {...props}
        >
          {children}
        </th>
      );
    },
    td({ children, ...props }: any) {
      return (
        <td className="border-t border-gray-200 px-4 py-2" {...props}>
          {children}
        </td>
      );
    },
    blockquote({ children, ...props }: any) {
      return (
        <blockquote
          className="border-l-4 border-gray-300 dark:border-gray-500 pl-4 italic my-4 text-gray-600 dark:text-gray-300"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    a({ children, href, ...props }: any) {
      return (
        <a
          href={href}
          className="text-blue-500 hover:text-blue-700 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    img({ src, alt, ...props }: any) {
      return src ? (
        <div className="relative my-4 w-full max-w-full h-auto rounded-md">
          <Image
            src={src}
            alt={alt || "Image"}
            width={500}
            height={300}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              height: "auto",
            }}
            {...props}
          />
        </div>
      ) : null;
    },
    li({ children, ...props }: any) {
      return (
        <li className="my-1" {...props}>
          {children}
        </li>
      );
    },
  };

  return (
    <div className="bg-transparent mr-auto w-full">
      <p className="text-sm font-semibold mb-1">
        <span className="flex items-center gap-2">
          Assistant
          {isLoading && <LuLoader className="animate-spin" />}
        </span>
      </p>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={MarkdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// Main ChatMessages Component
const ChatMessages = ({ messagesEndRef }: any) => {
  const { messages, loading } = useAppSelector((state) => state.chat);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedCode(text);
          setTimeout(() => {
            setCopiedCode(null);
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 mb-4 h-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
            <p>Start a conversation with the AI</p>
          </div>
        ) : (
          messages.map((message: any, index: number) => (
            <div
              key={index}
              className="p-2 border border-transparent hover:border-gray-400 delay-100 rounded-lg"
            >
              {message.role === "user" ? (
                <UserMessage content={message.content} />
              ) : (
                <AssistantMessage
                  content={message.content}
                  isLoading={
                    loading &&
                    index === messages.length - 1 &&
                    message.content === ""
                  }
                  copiedCode={copiedCode}
                  onCopy={handleCopy}
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;

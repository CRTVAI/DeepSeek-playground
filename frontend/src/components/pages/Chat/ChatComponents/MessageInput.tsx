"use client";

import Link from "next/link";
import { useState, FormEvent, useRef, useEffect } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height =
        scrollHeight <= 100 ? `${scrollHeight}px` : "100px";
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");

      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-end gap-2">
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            className="w-full p-3 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg resize-none min-h-[44px] max-h-[200px] overflow-y-auto focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50 transition-colors"
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50 transition-colors h-[44px] flex-shrink-0"
        >
          Send
        </button>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link
          href={"https://www.crtvai.com/"}
          target="_blank"
          className="text-xs text-[var(--text-muted)] mt-1 hover:text-blue-400 flex items-center gap-1.5 transition-colors duration-200"
        >
          <span>Powered by</span>
          <span className="font-semibold">CRTVAI</span>
          <span className="text-[0.65rem] opacity-75">•</span>
          <span className="text-[0.65rem] opacity-75">Deepseek Playground</span>
        </Link>
      </div>
    </form>
  );
};

export default MessageInput;

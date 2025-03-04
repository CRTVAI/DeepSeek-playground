"use client";

import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setInstruction } from "@/redux/features/chatSlice/chatSlice";
import React, { useState, useRef, useEffect } from "react";

const ChatInstructions = () => {
  const dispatch = useAppDispatch();
  const instruction = useAppSelector((state) => state.chat.instruction);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = isExpanded
        ? `${textareaRef.current.scrollHeight}px`
        : "60px";
    }
  }, [instruction, isExpanded]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setInstruction(e.target.value));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`mb-4 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg transition-all duration-300 ${
        isExpanded ? "h-auto" : "h-[110px]"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="instructions" className="block text-sm font-medium">
          System Instructions
        </label>
        <button
          onClick={toggleExpand}
          className="text-xs px-2 py-1 rounded border border-[var(--card-border)] hover:bg-[var(--input-bg)]"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id="instructions"
        value={instruction}
        onChange={handleChange}
        placeholder="Enter instructions for the AI (e.g., 'You are a helpful assistant')"
        className="w-full p-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg resize-none transition-all focus:ring-1 focus:ring-[var(--accent)]"
        onClick={() => !isExpanded && setIsExpanded(true)}
      />
    </div>
  );
};

export default ChatInstructions;

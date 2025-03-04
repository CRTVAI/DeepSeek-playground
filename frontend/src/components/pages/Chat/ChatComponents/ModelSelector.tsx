"use client";

import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setModelName } from "@/redux/features/chatSlice/chatSlice";
import React from "react";
// deepseek-reasoner
const modelOptions = [
  { id: "deepseek-chat", name: "deepseek-chat" },
  { id: "deepseek-reasoner", name: "deepseek-reasoner" },
  // { id: "gpt-4", name: "GPT-4" },
  // { id: "claude-3-opus", name: "Claude 3 Opus" },
  // { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  // { id: "claude-3-haiku", name: "Claude 3 Haiku" },
];

const ModelSelector = () => {
  const dispatch = useAppDispatch();
  const modelName = useAppSelector((state) => state.chat.modelName);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setModelName(e.target.value));
  };

  return (
    <div className="space-y-2">
      <label htmlFor="model-select" className="block text-sm font-medium mb-1">
        Model
      </label>
      <select
        id="model-select"
        value={modelName}
        onChange={handleChange}
        className="w-full p-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        {modelOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;

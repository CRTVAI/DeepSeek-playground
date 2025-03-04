"use client";

import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  clearMessages,
  sendMessage,
} from "@/redux/features/chatSlice/chatSlice";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { LuGithub, LuLoader, LuTrash2 } from "react-icons/lu";
import APIKeyInput from "./ChatComponents/APIKeyInput";
import ChatInstructions from "./ChatComponents/ChatInstructions";
import ChatMessages from "./ChatComponents/ChatMessages";
import MessageInput from "./ChatComponents/MessageInput";
import ModelSelector from "./ChatComponents/ModelSelector";
import ParametersControl from "./ChatComponents/ParametersControl";
import CancelButton from "./ChatComponents/CancelButton";
import { toast } from "sonner";
const Chat = () => {
  // Use Redux state and dispatch
  const dispatch = useAppDispatch();
  const { messages, loading, streamProgress, modelApi } = useAppSelector(
    (state) => state.chat
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (userMessage: string) => {
    if (loading) return;
    if (modelApi === "") return toast.error("Please Add API Key");
    if (!userMessage.trim()) return;
    dispatch(sendMessage(userMessage));
  };

  // Handle clearing messages
  const handleClearMessages = () => {
    dispatch(clearMessages());
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)]">
        <div className="flex items-center space-x-4">
          <Image
            src="https://raw.githubusercontent.com/CRTVAI/CRTVAI.assets/refs/heads/main/logo/LOGO/PNG-WHITE.png"
            alt="crtvai"
            width={500}
            height={500}
            quality={100}
            className="h-10 w-auto object-cover"
          />
          <h1 className="text-xl font-semibold">Deepseek Playground</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/CRTVAI/DeepSeek-playground"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
          >
            <span>🌟 Star on GitHub</span>
            <LuGithub className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="w-full flex flex-1 overflow-hidden">
        {/* Main chat area */}
        <div className="flex flex-col flex-grow p-4 overflow-hidden">
          {/* Instructions area */}
          <ChatInstructions />
          {/* <EnhancedStreamTester /> */}

          {/* Chat messages */}
          <ChatMessages messagesEndRef={messagesEndRef as any} />

          {/* User input */}
          <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>

        <div className="w-80 min-w-80 border-l border-[var(--card-border)] p-4 bg-[var(--card-bg)] flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Settings</h2>

          <div className="flex-1 space-y-4">
            <button
              onClick={handleClearMessages}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
              disabled={loading || messages.length === 0}
              title="Clear all messages"
            >
              <LuTrash2 />
              <span>Clear Chat</span>
            </button>
            <ModelSelector />
            <APIKeyInput />
            <ParametersControl />
          </div>

          {/* Settings footer */}
          <div className="mt-auto space-y-4 w-full">
            {loading && (
              <div className="flex items-center space-x-2 text-gray-600 w-full">
                <LuLoader className="w-4 h-4 animate-spin" />
                <span>
                  {streamProgress.isStreaming
                    ? "AI is responding..."
                    : "AI is thinking..."}
                </span>
              </div>
            )}
            {streamProgress.isStreaming && <CancelButton />}
            <div className="text-xs text-gray-500 pt-2 ">
              Last updated: 3 March 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

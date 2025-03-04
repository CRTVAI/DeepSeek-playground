"use client";

import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setStream } from "@/redux/features/chatSlice/chatSlice";
import React from "react";

export const StreamToggle = () => {
  const dispatch = useAppDispatch();
  const stream = useAppSelector((state) => state.chat.stream);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStream(e.target.checked));
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <input
          id="stream-toggle"
          type="checkbox"
          checked={stream}
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="stream-toggle"
          className={`relative flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors duration-200 ${
            stream ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"
          }`}
        >
          <span
            className={`absolute left-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
              stream ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </label>
      </div>
      <label htmlFor="stream-toggle" className="ml-3 text-sm cursor-pointer">
        Enable streaming
      </label>
    </div>
  );
};

"use client";

import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setModelApi } from "@/redux/features/chatSlice/chatSlice";
import React, { useState } from "react";

const APIKeyInput = () => {
  const dispatch = useAppDispatch();
  const modelApi = useAppSelector((state) => state.chat.modelApi);
  const [showKey, setShowKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setModelApi(e.target.value));
  };

  return (
    <div className="space-y-2">
      <label htmlFor="api-key" className="block text-sm font-medium mb-1">
        API Key
      </label>
      <div className="relative">
        <input
          id="api-key"
          type={showKey ? "text" : "password"}
          value={modelApi}
          onChange={handleChange}
          placeholder="Enter your API key"
          className="w-full p-2 pr-10 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] focus:outline-none"
        >
          {showKey ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                clipRule="evenodd"
              />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Your API key is stored locally and never sent to our servers.
      </p>
    </div>
  );
};

export default APIKeyInput;

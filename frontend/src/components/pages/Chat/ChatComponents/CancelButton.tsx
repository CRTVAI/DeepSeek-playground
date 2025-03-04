"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { cancelStreamingResponse } from "@/redux/features/chatSlice/chatSlice";
import { LuCircleMinus, LuLoader } from "react-icons/lu";

const CancelButton = () => {
  const dispatch = useAppDispatch();
  const { streamProgress } = useAppSelector((state) => state.chat);

  const handleCancelClick = () => {
    // Only dispatch if we have an active abort controller
    if (streamProgress.abortController) {
      dispatch(cancelStreamingResponse());
    }
  };

  return (
    <button
      onClick={handleCancelClick}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
      title="Cancel AI response"
      disabled={!streamProgress.abortController}
    >
      {streamProgress.abortController ? (
        <LuCircleMinus />
      ) : (
        <LuLoader className="animate-spin" />
      )}
      <span>Stop Response</span>
    </button>
  );
};

export default CancelButton;

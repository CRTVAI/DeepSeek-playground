"use client";
import { store } from "@/redux/app/store";
import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Toaster richColors />
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default ReduxProvider;

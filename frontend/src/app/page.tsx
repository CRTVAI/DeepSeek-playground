"use client";
import dynamic from "next/dynamic";
import React from "react";

const Chat = dynamic(() => import("@/components/pages/Chat/Chat"), {
  ssr: false,
});

const page = () => {
  return (
    <div className="w-full h-full">
      <Chat />
    </div>
  );
};

export default page;

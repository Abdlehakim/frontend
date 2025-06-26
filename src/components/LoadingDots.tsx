"use client";

import React from "react";

const LoadingDots = () => (
  <div className="flex justify-center space-x-1 z-10 w-full h-20 items-center">
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    />
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    />
  </div>
);

export default LoadingDots;

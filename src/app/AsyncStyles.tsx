"use client";
import { useEffect } from "react";

export default function AsyncStyles() {
  useEffect(() => {
    // Load non-critical CSS without blocking first paint.
    const sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "/styles/noncritical.css";
    sheet.media = "print"; // not applied to screen yet -> non-blocking
    sheet.onload = () => {
      sheet.media = "all"; // apply after it finishes loading
    };
    document.head.appendChild(sheet);

    return () => {
      sheet.remove();
    };
  }, []);

  return null;
}

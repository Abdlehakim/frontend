"use client";
import { useEffect } from "react";

export default function AsyncStyles() {
  useEffect(() => {
    // Preload (optional)
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "style";
    preload.href = "/styles/noncritical.css";
    document.head.appendChild(preload);

    // Non-blocking stylesheet
    const sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "/styles/noncritical.css";
    sheet.media = "print";
    sheet.onload = () => { sheet.media = "all"; };
    document.head.appendChild(sheet);

    return () => { preload.remove(); sheet.remove(); };
  }, []);

  return null;
}

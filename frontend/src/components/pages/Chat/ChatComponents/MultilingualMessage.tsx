"use client";
import React, { useMemo } from "react";
import { IntlProvider } from "react-intl";
import Markdown from "react-markdown";

interface MultilingualMessageProps {
  content: string;
}

const MultilingualMessage: React.FC<MultilingualMessageProps> = ({
  content,
}) => {
  // Detect language direction for the content
  const isRTL = useMemo(() => {
    // Unicode ranges for RTL scripts (Arabic, Hebrew, Persian, etc.)
    const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(content);
  }, [content]);

  // Enhance content for better display, especially for RTL languages
  const enhancedContent = useMemo(() => {
    // Start with normalized line breaks
    let processed = content
      // Convert all types of line breaks to standard form
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    // For RTL content, specifically handle Arabic question marks
    if (isRTL) {
      // If there's an Arabic question mark but no line break after it
      if (processed.includes("؟") && !processed.includes("؟\n")) {
        processed = processed.replace(/؟(\s*)([^\s])/g, "؟\n\n$2");
      }

      // Handle Arabic joke formats with colons
      processed = processed.replace(/:(\s*)([^\s])/g, ":\n\n$2");
    }

    // Preserve consecutive line breaks that indicate paragraphs
    processed = processed
      .replace(/\n\n+/g, "§PARAGRAPH§")
      // Normalize extra spaces but not line breaks
      .replace(/[^\S\n]+/g, " ")
      // Replace preserved paragraphs
      .replace(/§PARAGRAPH§/g, "\n\n")
      .trim();

    return processed;
  }, [content, isRTL]);

  return (
    <IntlProvider locale={isRTL ? "ar" : "en"}>
      <div
        className="rtl-content"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          textAlign: isRTL ? "right" : "left",
          whiteSpace: "pre-wrap", // Preserve formatting including line breaks
          wordBreak: "break-word", // Break long words if needed
          lineHeight: "1.6", // Improve readability with better line height
          marginBottom: "0.5rem", // Add spacing between paragraphs
        }}
      >
        <Markdown>{enhancedContent}</Markdown>
      </div>
    </IntlProvider>
  );
};

export default MultilingualMessage;

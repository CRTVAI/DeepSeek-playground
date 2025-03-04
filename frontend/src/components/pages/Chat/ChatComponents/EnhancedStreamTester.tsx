"use client";
// EnhancedStreamTester.tsx
import { useState, useRef, useEffect } from "react";
import { server } from "@/backend";

const EnhancedStreamTester = () => {
  const [streamText, setStreamText] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Function to add a log entry
  const addLog = (message: string) => {
    setLogs((prev) => {
      const newLogs = [
        ...prev,
        `${new Date().toISOString().substring(11, 23)}: ${message}`,
      ];
      // Keep only last 100 logs to prevent performance issues
      if (newLogs.length > 100) {
        return newLogs.slice(newLogs.length - 100);
      }
      return newLogs;
    });

    // Auto-scroll logs
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      }
    }, 10);
  };

  // Cleanup function for EventSource
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Alternative method using fetch and manual processing (as you had before)
  const testStreamWithFetch = async () => {
    setStreamText("");
    setLoading(true);
    setLogs([]);
    addLog("Starting stream test with fetch");

    try {
      const requestData = {
        userMessage: "tell me a joke in arabic with translation",
        userInstruction:
          "You are a helpful assistant. you will alwasy response in json",
        modelApi: "", // Replace with your actual API key
        modelName: "deepseek-chat",
        stream: true,
      };

      addLog("Sending fetch request");

      const response = await fetch(`${server}/ai-playground/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      addLog(`Response received: ${response.status} ${response.statusText}`);
      addLog(
        `Headers: ${JSON.stringify(Object.fromEntries([...response.headers]))}`
      );

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      addLog("Stream reader setup complete");

      let buffer = "";
      let chunkCount = 0;
      let totalChars = 0;
      const startTime = Date.now();

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const totalTime = Date.now() - startTime;
          addLog(`Stream complete after ${totalTime}ms`);
          addLog(`Received ${chunkCount} chunks, total ${totalChars} chars`);
          break;
        }

        // Decode the chunk
        const text = decoder.decode(value, { stream: true });
        chunkCount++;
        totalChars += text.length;

        // Add to buffer
        buffer += text;

        // Process SSE format manually
        // SSE format: "event: type\ndata: payload\n\n"
        const events = buffer.split("\n\n");

        // Keep the last part in buffer (might be incomplete)
        buffer = events.pop() || "";

        // Process complete events
        for (const eventText of events) {
          if (!eventText.trim()) continue;

          // Extract event type and data
          const eventLines = eventText.split("\n");
          let eventType = "";
          let eventData = "";

          for (const line of eventLines) {
            if (line.startsWith("event:")) {
              eventType = line.substring(6).trim();
            } else if (line.startsWith("data:")) {
              eventData = line.substring(5).trim();
            }
          }

          addLog(`SSE Event: ${eventType}, Data: ${eventData}`);

          // Handle different event types
          if (eventType === "chunk") {
            try {
              const data = JSON.parse(eventData);
              if (data.content) {
                setStreamText((prev) => prev + data.content);
              }
            } catch (error) {
              addLog(`Error parsing chunk data: ${error}`);
            }
          }

          if (eventType === "end") {
            addLog("Received end event");
          }
        }
      }
    } catch (error) {
      addLog(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Enhanced Stream Tester</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={testStreamWithFetch}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test with Fetch"}
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Stream Output:</h3>
        <div className="mt-2 p-2 border rounded bg-gray-800 min-h-32 overflow-auto whitespace-pre-wrap">
          {streamText || "No stream data yet"}
        </div>
      </div>

      <h3 className="text-lg font-bold mt-4">Logs:</h3>
      <div
        ref={logContainerRef}
        className="mt-2 p-2 border rounded bg-black text-green-400 font-mono text-xs h-64 overflow-auto"
      >
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedStreamTester;

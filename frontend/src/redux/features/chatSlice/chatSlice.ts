import { server } from "@/backend";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define types
export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messages: Message[];
  instruction: string;
  modelApi: string;
  modelName: string;
  stream: boolean;
  loading: boolean;
  error: string | null;
  streamProgress: {
    isStreaming: boolean;
    fullContent: string;
    abortController: AbortController | null;
  };
  temperature: number;
  topP: number;
  maxTokens: number;
}

// Update your initialState with default values:
const initialState: ChatState = {
  messages: [],
  instruction: "",
  modelApi: "",
  modelName: "deepseek-chat",
  stream: true,
  loading: false,
  error: null,
  streamProgress: {
    isStreaming: false,
    fullContent: "",
    abortController: null,
  },
  temperature: 1.0,
  topP: 1.0,
  maxTokens: 1024,
};

// Add a new action to cancel streaming:
export const cancelStreamingResponse = createAsyncThunk(
  "chat/cancelStreamingResponse",
  async (_, { getState, dispatch }) => {
    const state = getState() as { chat: ChatState };

    // Abort the fetch request if an abort controller exists
    if (state.chat.streamProgress.abortController) {
      state.chat.streamProgress.abortController.abort();

      // Update assistant message to indicate cancellation
      dispatch(
        updateAssistantMessage(
          state.chat.streamProgress.fullContent + " [Response stopped by user]"
        )
      );

      // Reset streaming state
      dispatch(
        setStreamProgress({
          isStreaming: false,
          fullContent: state.chat.streamProgress.fullContent,
          abortController: null,
        })
      );
    }

    return;
  }
);

// Define the sendMessage async thunk
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (userMessage: string, { getState, dispatch }) => {
    const state = getState() as { chat: ChatState };
    const {
      instruction,
      modelApi,
      modelName,
      stream,
      temperature,
      topP,
      maxTokens,
    } = state.chat;

    // Add user message to state
    dispatch(addUserMessage(userMessage));

    // Add empty assistant message that we'll update with streaming content
    dispatch(addAssistantMessage(""));

    try {
      const requestData = {
        userMessage,
        userInstruction: instruction,
        modelApi,
        modelName,
        stream,
        temperature,
        topP,
        maxTokens,
      };

      if (stream) {
        // Stream mode
        // Create an AbortController
        const abortController = new AbortController();

        // Store the AbortController in state
        dispatch(
          setStreamProgress({
            isStreaming: true,
            fullContent: "",
            abortController,
          })
        );

        const response = await fetch(`${server}/ai-playground/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          signal: abortController.signal, // Connect the abort controller's signal to the fetch request
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let fullResponse = "";

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Stream complete
            dispatch(
              setStreamProgress({
                isStreaming: false,
                fullContent: fullResponse,
                abortController: null, // Clear the AbortController
              })
            );
            break;
          }

          // Decode the chunk
          const text = decoder.decode(value, { stream: true });

          // Add to buffer
          buffer += text;

          // Process SSE format: "event: type\ndata: payload\n\n"
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

            // Handle different event types
            if (eventType === "chunk") {
              try {
                const data = JSON.parse(eventData);
                if (data.content) {
                  fullResponse += data.content;
                  dispatch(updateAssistantMessage(fullResponse));
                }
              } catch (error) {
                console.error("Error parsing chunk data:", error);
              }
            }
          }
        }

        return fullResponse;
      } else {
        // Create an AbortController
        const abortController = new AbortController();
        // Non-stream mode
        dispatch(
          setStreamProgress({
            isStreaming: false,
            fullContent: "",
            abortController: abortController, // Store the AbortController
          })
        );

        const response = await fetch(`${server}/ai-playground/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          signal: abortController.signal, // Connect the abort controller's signal to the fetch request
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        const aiResponse = data.aiResponse || "";

        dispatch(updateAssistantMessage(aiResponse));

        // Clear the abort controller after the request is complete
        dispatch(
          setStreamProgress({
            isStreaming: false,
            fullContent: aiResponse,
            abortController: null,
          })
        );

        return aiResponse;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // This is the expected error when we cancel the request
        // We already handled the cancellation in the cancelStreamingResponse thunk
        return "[Response stopped by user]";
      }

      // Update the assistant message with the error
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      dispatch(updateAssistantMessage(`Error: ${errorMessage}`));

      // Reset streaming state
      dispatch(
        setStreamProgress({
          isStreaming: false,
          fullContent: "",
          abortController: null,
        })
      );

      throw error;
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload;
    },
    setTopP: (state, action: PayloadAction<number>) => {
      state.topP = action.payload;
    },
    setMaxTokens: (state, action: PayloadAction<number>) => {
      state.maxTokens = action.payload;
    },
    setInstruction: (state, action: PayloadAction<string>) => {
      state.instruction = action.payload;
    },
    setModelApi: (state, action: PayloadAction<string>) => {
      state.modelApi = action.payload;
    },
    setModelName: (state, action: PayloadAction<string>) => {
      state.modelName = action.payload;
    },
    setStream: (state, action: PayloadAction<boolean>) => {
      state.stream = action.payload;
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        role: "user",
        content: action.payload,
      });
    },
    addAssistantMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        role: "assistant",
        content: action.payload,
      });
    },
    updateAssistantMessage: (state, action: PayloadAction<string>) => {
      const lastIndex = state.messages.length - 1;
      if (lastIndex >= 0 && state.messages[lastIndex].role === "assistant") {
        state.messages[lastIndex].content = action.payload;
      } else {
        state.messages.push({
          role: "assistant",
          content: action.payload,
        });
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setStreamProgress: (
      state,
      action: PayloadAction<{
        isStreaming: boolean;
        fullContent: string;
        abortController: AbortController | null;
      }>
    ) => {
      state.streamProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(cancelStreamingResponse.pending, (state) => {
        // Immediate UI feedback when cancellation is triggered
        state.loading = true;
      })
      .addCase(cancelStreamingResponse.fulfilled, (state) => {
        // Update UI state after cancellation is complete
        state.loading = false;
      });
  },
});

export const {
  setInstruction,
  setModelApi,
  setModelName,
  setStream,
  addUserMessage,
  addAssistantMessage,
  updateAssistantMessage,
  clearMessages,
  setStreamProgress,
  setMaxTokens,
  setTemperature,
  setTopP,
} = chatSlice.actions;

export default chatSlice.reducer;

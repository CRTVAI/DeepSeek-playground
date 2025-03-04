package controllers

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/crtvai/ai-playground/ai-backend/utils"
	"github.com/sirupsen/logrus"
)

// DeepseekMessage represents a message in the conversation
type DeepseekMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// DeepseekRequest represents the request to be sent to Deepseek API
type DeepseekRequest struct {
	Model       string            `json:"model"`
	Messages    []DeepseekMessage `json:"messages"`
	Stream      bool              `json:"stream"`
	Temperature float64           `json:"temperature,omitempty"`
	TopP        float64           `json:"top_p,omitempty"`
	MaxTokens   int               `json:"max_tokens,omitempty"`
}

type DeepseekResponse map[string]any

// ChatWithAIRequest represents the request from your frontend
type ChatWithAIRequest struct {
	UserMessage     string  `json:"userMessage"`
	UserInstruction string  `json:"userInstruction"`
	ModelAPI        string  `json:"modelApi"`
	ModelName       string  `json:"modelName"`
	Stream          bool    `json:"stream"`
	Temperature     float64 `json:"temperature"`
	TopP            float64 `json:"topP"`
	MaxTokens       int     `json:"maxTokens"`
}

// ChatWithAIResponse represents the response to your frontend
type ChatWithAIResponse struct {
	AIResponse string `json:"aiResponse"`
	Error      string `json:"error,omitempty"`
}

var (
	LogError      = utils.LogError
	ErrorResponse = utils.ErrorResponse
	JsonResponse  = utils.JsonResponse
)

func ChatwithAi(w http.ResponseWriter, r *http.Request) {
	logrus.Info("Starting ChatwithAi request")

	// Get the request context which will be cancelled when the client disconnects
	ctx := r.Context()

	var chatWithAIRequest ChatWithAIRequest

	if err := json.NewDecoder(r.Body).Decode(&chatWithAIRequest); err != nil {
		LogError(r, err)
		ErrorResponse(w, r, http.StatusBadRequest, "Invalid request body")
		return
	}

	apiKey := chatWithAIRequest.ModelAPI
	if apiKey == "" {
		ErrorResponse(w, r, http.StatusBadRequest, "API key is required")
		return
	}

	logrus.Infof("Chat request with stream=%v for model %s", chatWithAIRequest.Stream, chatWithAIRequest.ModelName)

	messages := []DeepseekMessage{
		{
			Role:    "system",
			Content: chatWithAIRequest.UserInstruction,
		},
		{
			Role:    "user",
			Content: chatWithAIRequest.UserMessage,
		},
	}

	// Use the model provided in the request or default to "deepseek-chat"
	model := "deepseek-chat"
	if chatWithAIRequest.ModelName != "" {
		model = chatWithAIRequest.ModelName
	}

	// Create the request body for the Deepseek API
	deepseekReq := DeepseekRequest{
		Model:       model,
		Messages:    messages,
		Stream:      chatWithAIRequest.Stream,
		Temperature: chatWithAIRequest.Temperature,
		TopP:        chatWithAIRequest.TopP,
		MaxTokens:   chatWithAIRequest.MaxTokens,
	}

	// Convert the request to JSON
	reqBody, err := json.Marshal(deepseekReq)
	if err != nil {
		LogError(r, err)
		ErrorResponse(w, r, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Create HTTP request to Deepseek API with context
	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.deepseek.com/v1/chat/completions", bytes.NewBuffer(reqBody))
	if err != nil {
		LogError(r, err)
		ErrorResponse(w, r, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{
		// Set a timeout to prevent hung connections
		Timeout: 60 * time.Second,
	}
	logrus.Info("Sending request to Deepseek API")

	// If streaming is requested
	if chatWithAIRequest.Stream {
		// ** Critical streaming headers **
		w.Header().Set("Content-Type", "text/event-stream") // Changed to SSE format
		w.Header().Set("Cache-Control", "no-cache, no-transform")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("X-Accel-Buffering", "no") // Disable Nginx buffering

		logrus.Info("Headers set for streaming response")

		// Create a flusher to send data as it's received
		flusher, ok := w.(http.Flusher)
		if !ok {
			logrus.Error("Streaming not supported")
			ErrorResponse(w, r, http.StatusInternalServerError, "Streaming not supported")
			return
		}

		// Make the request to Deepseek
		resp, err := client.Do(req)
		if err != nil {
			// Check if the error was due to client cancellation
			if ctx.Err() == context.Canceled {
				logrus.Info("Request was cancelled by client")
				return
			}
			LogError(r, err)
			ErrorResponse(w, r, http.StatusInternalServerError, "Failed to communicate with AI service")
			return
		}
		defer resp.Body.Close()

		logrus.Infof("Received response from Deepseek, status: %d", resp.StatusCode)

		// Check if the response is successful
		if resp.StatusCode != http.StatusOK {
			var errorResponse map[string]interface{}
			if err := json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
				LogError(r, err)
				ErrorResponse(w, r, http.StatusInternalServerError, "Error from AI service: "+resp.Status)
				return
			}

			errorMsg, _ := json.Marshal(errorResponse)
			ErrorResponse(w, r, resp.StatusCode, string(errorMsg))
			return
		}

		// Send event to indicate start of streaming
		fmt.Fprintf(w, "event: start\ndata: {}\n\n")
		flusher.Flush()
		logrus.Info("Sent start event")

		// Create a scanner to read the response line by line
		scanner := bufio.NewScanner(resp.Body)

		// Process each line (event) from the stream
		chunkCount := 0
		startTime := time.Now()
		var fullResponse strings.Builder // Track full response for metadata

		logrus.Info("Starting to process streaming response")

		// Create a done channel for signaling cancellation in the goroutine
		done := make(chan struct{})

		// Process streaming in a separate goroutine
		go func() {
			defer close(done)

			for scanner.Scan() {
				// Check if the client has disconnected
				if ctx.Err() != nil {
					logrus.Info("Client disconnected, stopping stream")
					return
				}

				line := scanner.Text()

				// Skip empty lines
				if line == "" {
					continue
				}

				// Log every 10 chunks to avoid flooding logs
				if chunkCount%10 == 0 {
					timeSinceStart := time.Since(startTime)
					logrus.Infof("Processing chunk #%d after %v ms", chunkCount, timeSinceStart.Milliseconds())
				}
				chunkCount++

				// Remove the "data: " prefix if it exists
				if strings.HasPrefix(line, "data: ") {
					line = strings.TrimPrefix(line, "data: ")

					// Check for the "[DONE]" message that signals the end of the stream
					if line == "[DONE]" {
						logrus.Info("Received [DONE] signal, stream complete")

						// Send event to indicate end of streaming
						fmt.Fprintf(w, "event: end\ndata: {}\n\n")
						flusher.Flush()
						return
					}

					// Parse the JSON response
					var streamResponse DeepseekResponse
					if err := json.Unmarshal([]byte(line), &streamResponse); err != nil {
						logrus.Warnf("Error unmarshaling chunk: %v", err)
						continue
					}

					// Extract the content from the response
					var content string
					if choices, ok := streamResponse["choices"].([]interface{}); ok && len(choices) > 0 {
						if choice, ok := choices[0].(map[string]interface{}); ok {
							if delta, ok := choice["delta"].(map[string]interface{}); ok {
								if c, ok := delta["content"].(string); ok {
									content = c
								}
							}
						}
					}

					// Debug log content length
					if chunkCount%10 == 0 {
						logrus.Infof("Chunk #%d content length: %d", chunkCount, len(content))
					}

					if content != "" {
						// Append content to full response tracker
						fullResponse.WriteString(content)

						// Create a data packet in the SSE format
						// Wrap content in a JSON object with a "content" field
						dataPacket := map[string]string{
							"content": content,
						}
						dataJSON, err := json.Marshal(dataPacket)
						if err != nil {
							logrus.Warnf("Error marshaling content: %v", err)
							continue
						}

						// Send the content to the client in SSE format
						fmt.Fprintf(w, "event: chunk\ndata: %s\n\n", dataJSON)
						flusher.Flush()
					}

					// Log that we flushed (for every 10th chunk)
					if chunkCount%10 == 0 {
						logrus.Info("Flushed response buffer")
					}
				}
			}

			if err := scanner.Err(); err != nil {
				LogError(r, err)
				// We've already started streaming, so we can't send an error response
				// Just log the error and return
				return
			}
		}()

		// Wait for either the streaming to complete or the client to disconnect
		select {
		case <-done:
			// Streaming completed successfully
			logrus.Infof("Streaming complete. Processed %d chunks in %v ms",
				chunkCount, time.Since(startTime).Milliseconds())
		case <-ctx.Done():
			// Client disconnected
			logrus.Info("Client disconnected, aborting streaming")
			// No need to do anything else as the goroutine will detect the cancellation
		}

	} else {
		// Non-streaming mode
		logrus.Info("Using non-streaming mode")
		resp, err := client.Do(req)
		if err != nil {
			// Check if the error was due to client cancellation
			if ctx.Err() == context.Canceled {
				logrus.Info("Request was cancelled by client")
				return
			}
			LogError(r, err)
			ErrorResponse(w, r, http.StatusInternalServerError, "Failed to communicate with AI service")
			return
		}
		defer resp.Body.Close()

		// Check if the response is successful
		if resp.StatusCode != http.StatusOK {
			var errorResponse map[string]interface{}
			if err := json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
				LogError(r, err)
				ErrorResponse(w, r, http.StatusInternalServerError, "Error from AI service: "+resp.Status)
				return
			}

			errorMsg, _ := json.Marshal(errorResponse)
			ErrorResponse(w, r, resp.StatusCode, string(errorMsg))
			return
		}

		// Parse the response
		var deepseekResp DeepseekResponse
		if err := json.NewDecoder(resp.Body).Decode(&deepseekResp); err != nil {
			LogError(r, err)
			ErrorResponse(w, r, http.StatusInternalServerError, "Failed to parse AI response")
			return
		}

		// Extract the content from the response
		var content string
		if choices, ok := deepseekResp["choices"].([]interface{}); ok && len(choices) > 0 {
			if choice, ok := choices[0].(map[string]interface{}); ok {
				if message, ok := choice["message"].(map[string]interface{}); ok {
					if c, ok := message["content"].(string); ok {
						content = c
					}
				}
			}
		}

		// Prepare and send the response
		response := ChatWithAIResponse{
			AIResponse: content,
		}

		logrus.Info("Sending non-streaming response")
		JsonResponse(w, r, http.StatusOK, response)
	}
}

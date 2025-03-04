package utils

import (
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
)

type ErrorResponseType struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ErrorHandler struct {
	StatusCode int
	Message    string
}

func LogError(r *http.Request, err error) {
	logrus.Errorf("Error Received: %s %s %s", err, r.Method, r.URL.Path)
}

func NewErrorHandler(message string, statusCode int) *ErrorHandler {
	return &ErrorHandler{
		StatusCode: statusCode,
		Message:    message,
	}
}

func ErrorResponse(w http.ResponseWriter, r *http.Request, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	// create error response
	errorResponse := ErrorResponseType{
		Success: false,
		Message: message,
	}
	jsonData, err := json.Marshal(errorResponse)

	if err != nil {
		// If unable to marshal, log the error and send a generic error response
		LogError(r, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return

	}

	_, err = w.Write(jsonData)

	if err != nil {
		// If unable to write response, log the error
		LogError(r, err)
	}

}

func JsonResponse(w http.ResponseWriter, r *http.Request, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		// If unable to marshal, log the error and send a generic error response
		LogError(r, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

}

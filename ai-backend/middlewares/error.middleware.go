package middlewares

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/crtvai/ai-playground/ai-backend/utils"
)

type errorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func ErrorMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		defer func() {
			if err := recover(); err != nil {
				var customErr *utils.ErrorHandler

				// Check if the error is of type ErrorHandler

				switch e := err.(type) {

				case *utils.ErrorHandler:
					customErr = e

				default:
					// If not, treat it as a generic internal server error
					customErr = utils.NewErrorHandler("Internal Server Error", http.StatusInternalServerError)
				}

				response := errorResponse{
					Success: false,
					Message: customErr.Message,
				}

				// Set the header and write the JSON response
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(customErr.StatusCode)

				if err := json.NewEncoder(w).Encode(response); err != nil {
					log.Printf("Failed to write JSON response: %v", err)
				}

			}
		}()
		next.ServeHTTP(w, r)

	})

}

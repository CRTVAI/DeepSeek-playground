package v1

import (
	"net/http"

	"github.com/crtvai/ai-playground/ai-backend/controllers"
)

func AiPlaygroundRoutes() *http.ServeMux {
	router := http.NewServeMux()
	router.HandleFunc("/chat", controllers.ChatwithAi)

	return router
}

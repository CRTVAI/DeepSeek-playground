package routes

import (
	"net/http"

	"github.com/crtvai/ai-playground/ai-backend/middlewares"
	v1 "github.com/crtvai/ai-playground/ai-backend/routes/v1"
)

func SetupIndexRoutes() http.Handler {
	rootRoutes := http.NewServeMux()

	aiplaygroundRoutes := v1.AiPlaygroundRoutes()

	rootRoutes.Handle("/api/v1/ai-playground/", http.StripPrefix("/api/v1/ai-playground", aiplaygroundRoutes))

	rootRoutes.HandleFunc("/{$}", middlewares.LogMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		html := `<h1>Server is running</h1>`

		w.Write([]byte(html))
	}))
	return rootRoutes
}

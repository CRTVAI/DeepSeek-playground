package main

import (
	"net/http"
	"os"

	"github.com/crtvai/ai-playground/ai-backend/lib"
	"github.com/crtvai/ai-playground/ai-backend/middlewares"
	"github.com/crtvai/ai-playground/ai-backend/routes"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
)

func main() {

	lib.ConfigurLogger()

	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	root := routes.SetupIndexRoutes()

	corsOptions := cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Explicitly allow your frontend's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}

	corsSetup := cors.New(corsOptions)

	handler := corsSetup.Handler(root)
	errorHandler := middlewares.ErrorMiddleware(handler)

	startServer(errorHandler)

}

func startServer(handler http.Handler) {

	port := os.Getenv("PORT")

	if port == "" {
		port = ":8000"
	}

	logrus.Warn("Server running on: ", port)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		logrus.Fatal("Failed to start server", err)
	}
}

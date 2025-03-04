package middlewares

import (
	"net/http"

	"github.com/sirupsen/logrus"
)

type statusRecorder struct {
	http.ResponseWriter
	StatusCode int
}

// Override the WriteHeader method to capture the status code

func (rec *statusRecorder) WriteHeader(statusCode int) {
	rec.StatusCode = statusCode
	rec.ResponseWriter.WriteHeader(statusCode)
}

// Log Middleware
func LogMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// creatse status recorder to capture
		rec := &statusRecorder{
			ResponseWriter: w,
			StatusCode:     http.StatusOK, // default status code
		}

		logrus.Infof("Request Received: %s %s", r.Method, r.URL.Path)

		// calling
		next(rec, r)

		// Log the response code after the handler being exicuted
		logrus.Infof("Response Status: %d %s %s", rec.StatusCode, r.Method, r.URL.Path)
	}
}

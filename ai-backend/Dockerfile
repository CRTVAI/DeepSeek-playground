FROM golang:latest

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod tidy

# Copy all files
COPY . .

# Build the application
RUN go build -o main .

# Run the application
CMD ["./main"]
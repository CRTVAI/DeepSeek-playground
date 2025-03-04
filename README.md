# DeepSeek Playground

![DeepSeek Playground Logo](https://raw.githubusercontent.com/CRTVAI/CRTVAI.assets/83cb3e5f2c82c6374121355f9c9489a74e69ab10/projects/aiplayground/metaimage.png)

A powerful and intuitive interface for interacting with DeepSeek AI models. This playground allows users to easily chat with various DeepSeek models using their API key, with support for streaming responses and customizable model parameters.

## Features

- **Simple Authentication**: Use your DeepSeek API key to access all available models
- **Streaming Support**: See responses appear in real-time as they're generated
- **Model Selection**: Choose from all available DeepSeek models
- **Parameter Customization**: Fine-tune your experience with temperature, top_p, max output tokens, and more
- **Clean Interface**: Intuitive chat UI with instruction bar at top, message input at bottom, and settings on the right
- **Tech Stack**: Go backend for performance, Next.js frontend for responsiveness

## Getting Started

### Option 1: Using Docker (Recommended)

1. **Prerequisites**

   - [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system

2. **Setup**

   - Clone this repository
   - Navigate to the root directory containing the `compose.yml` file

3. **Configuration**

   - Create a `.env` file in the `ai-backend` directory with your configuration settings

4. **Launch**

   ```bash
   docker compose up -d
   ```

5. **Access**
   - Open your browser and navigate to `http://localhost:3000`

### Option 2: Manual Setup

1. **Backend Setup**

   - Navigate to the `ai-backend` directory
   - Run `go mod tidy` to ensure dependencies are correctly set up
   - Create a `.env` file with your configuration settings
   - Start the backend server:
     ```bash
     go run main.go
     ```
   - The backend will run on `http://localhost:8000`

2. **Frontend Setup**
   - Navigate to the `frontend` directory
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - The frontend will run on `http://localhost:3000`

## Project Structure

```
deepseek-playground/
├── ai-backend/           # Go backend
│   ├── main.go           # Entry point
│   ├── Dockerfile        # Backend Docker configuration
│   ├── .env              # Environment variables (create this)
│   └── ...
├── frontend/             # Next.js frontend
│   ├── src/              # Application code
│   ├── Dockerfile        # Frontend Docker configuration
│   └── ...
└── compose.yml           # Docker Compose configuration
```

## Usage

1. Open the DeepSeek Playground in your browser
2. Enter your DeepSeek API key in the settings panel
3. Select your preferred model and adjust parameters as needed
4. Type instructions or messages in the input field
5. View streaming responses in the chat area

## API Key

To use this playground, you'll need to obtain an API key from DeepSeek. Visit the [DeepSeek Platform](https://platform.deepseek.com/) to sign up and get your API key.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/CRTVAI/CRTVAI.assets/refs/heads/main/projects/aiplayground/s1.png" width="200">
  <img src="https://raw.githubusercontent.com/CRTVAI/CRTVAI.assets/refs/heads/main/projects/aiplayground/s2.png" width="200">

</p>

## Contributing

We welcome contributions, suggestions, and feedback! Please feel free to:

- Submit issues for bug reports or feature requests
- Create pull requests for improvements
- Share your feedback and ideas

## Legal Notice

This project is an independent interface for DeepSeek's AI models and is not affiliated with, endorsed by, or sponsored by DeepSeek. The DeepSeek Playground is developed by CRTVAI as a free, open-source tool for the community to facilitate interaction with DeepSeek's publicly available API. All trademarks and registered trademarks are the property of their respective owners.

## About CRTVAI

CRTVAI is a diverse collective united by a shared passion for creativity and excellence in AI solutions. As a leading Machine Learning Consulting Firm, we specialize in transforming ideas into reality through software mastery, hardware expertise, and cutting-edge AI development.

Our team brings ChatGPT and large language model expertise to businesses, ensuring quality assurance, seamless integration, and tailored solutions that drive innovation.

### Contact Us

For inquiries, support, or more information:

- **Email**: info@crtvai.com
- **Phone**: (+962) 6 222 6991
- **Location**: Amman, Jordan, Khalil Dabbas Street
- **Website**: [crtvai.com](https://crtvai.com)

---

© 2025 CRTVAI. All rights reserved.

# 🛒 Smart Product Review System (Microservices)

A full-stack **Microservices Application** that allows users to manage products and analyze customer reviews using **AI-powered Sentiment Analysis**. This project demonstrates a containerized architecture using **Docker** and **Docker Compose**.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 🏗️ Architecture

The system consists of 4 isolated services communicating via REST APIs:

1.  **Frontend Client:** A React.js application (Vite) for the user interface.
2.  **API Gateway:** A Node.js/Express (TypeScript) gateway that routes requests to backend services.
3.  **Product Service:** A Java (Spring Boot) service to manage product data.
4.  **Sentiment Service:** A Python (Flask) service using `TextBlob` to analyze review sentiment (Positive/Neutral/Negative).

## 🚀 Tech Stack

| Component | Technology | Port |
|-----------|------------|------|
| **Frontend** | React, Vite, Node.js 22 | `5173` |
| **API Gateway** | Node.js, Express, TypeScript | `5000` |
| **Product Service** | Java 21, Spring Boot | `8080` |
| **Sentiment Service** | Python 3.9, Flask, TextBlob | `5001` |
| **DevOps** | Docker, Docker Compose | - |

## 🛠️ Prerequisites

- **Docker Desktop** installed and running.
- **Git** (to clone the repository).

## 📦 How to Run (Using Docker)

You don't need to install Java, Python, or Node.js locally. Docker handles everything!

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/smart-product-system.git](https://github.com/YOUR_USERNAME/smart-product-system.git)
    cd smart-product-system
    ```

2.  **Build and Start the System:**
    Run this single command in the root directory:
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the Application:**
    Open your browser and navigate to:
    ```
    http://localhost:5173
    ```

4.  **Stop the Application:**
    ```bash
    docker-compose down
    ```

## 🧪 Testing the Application

1.  Go to the web interface (`http://localhost:5173`).
2.  **Add a Product:** Enter a name and price (e.g., "iPhone 15", "$999").
3.  **Write a Review:** Click on the product and type a review.
    * *Example:* "I love this phone! The battery is amazing."
4.  **View Sentiment:** The Python AI service will analyze the text and display the sentiment (e.g., "Positive" in Green).

## 📂 Project Structure

```bash
smart-product-system/
├── api-gateway-node/       # Node.js + TypeScript Gateway
├── frontend-client/        # React + Vite Frontend
├── product-service-java/   # Spring Boot Backend
├── sentiment-service-python/ # Python Flask AI Service
├── docker-compose.yml      # Docker Orchestration Config
└── README.md               # Documentation
```

## 👤 Author

**M.Hasindu Udara** *Software Engineering Undergraduate*

- 🐙 **GitHub:** [View Profile](https://github.com/hasinduudara)
- 💼 **LinkedIn:** [Connect on LinkedIn](https://www.linkedin.com/in/hasindu-udara)

---
*Built with ❤️ using **Microservices Architecture** & **Docker**.*

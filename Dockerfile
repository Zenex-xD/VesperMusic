# Stage 1: Build Frontend (React + Vite)
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Python FastAPI Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Copy backend application
COPY main.py .

# Environment setup
ENV PORT=3000
ENV PYTHONUNBUFFERED=1

EXPOSE 3000

CMD ["python", "main.py"]

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for process monitoring and report generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    procps \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

ENV SENTINAI_PORT=8000

CMD ["uvicorn", "sentinai_enterprise_backend:app", "--host", "0.0.0.0", "--port", "8000"]

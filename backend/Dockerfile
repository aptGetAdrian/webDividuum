# Use Python 3.10
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . .

# Expose port
ENV PORT=8080
CMD ["gunicorn", "-b", ":8080", "main:app"]
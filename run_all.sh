#!/bin/bash

# Kill any existing processes on ports 5000 and 5001
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Start Python backend in background
echo "Starting Python backend on port 5001..."
cd python_server
python app.py > ../python_server.log 2>&1 &
PYTHON_PID=$!
cd ..

# Give Python server time to start
sleep 3

# Start Vite frontend (which will proxy /api requests to Python backend)
echo "Starting Vite frontend..."
npm run dev

# Cleanup on exit
trap "kill $PYTHON_PID" EXIT

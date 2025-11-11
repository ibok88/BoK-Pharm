#!/bin/bash

# Start Python backend
echo "Starting Python backend on port 5001..."
cd python_server && python app.py &
PYTHON_PID=$!

# Wait a moment for Python backend to start
sleep 2

# Start Node.js/Vite frontend
echo "Starting Vite frontend..."
cd ..
npm run dev &
VITE_PID=$!

# Wait for both processes
wait $PYTHON_PID $VITE_PID

#!/bin/sh

# Start the Node.js application in the background
npm run dev &

# Run the Python script in the foreground
python3 main.py

# Wait for all background jobs to finish
wait

#!/bin/bash
# Compile TypeScript
echo "Compiling TypeScript..."
tsc

# Build and deploy Reader function along with API Gateway endpoint using AWS SAM CLI
echo "Building Service..."
docker-compose build

echo "Starting Cache server"
docker-compose up

#!/bin/bash

# Database connection helper script
# Usage: ./scripts/db-connect.sh [command]

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Extract database details from Supabase URL
SUPABASE_PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | cut -d'/' -f3 | cut -d'.' -f1)

# Connection details (you may need to update the password)
DB_HOST="db.${SUPABASE_PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="goodreadspuzzles2024"  # Update this if different

# Full connection string
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "Connecting to: ${DB_HOST}"
echo "Project ID: ${SUPABASE_PROJECT_ID}"

if [ $# -eq 0 ]; then
    # Interactive mode
    echo "Starting interactive psql session..."
    psql "${DATABASE_URL}"
else
    # Execute command mode
    echo "Executing: $1"
    psql "${DATABASE_URL}" -c "$1"
fi
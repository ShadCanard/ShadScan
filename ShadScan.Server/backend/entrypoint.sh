#!/bin/sh
# entrypoint for backend container
# ensures database is reachable, runs migrations then seed, then starts app

# wait for database service to accept connections
echo "Waiting for database at $DATABASE_URL..."
# extract host and port from DATABASE_URL, default to db:3306
DB_HOST="db"
DB_PORT="3306"
# simple check with nc (busybox) until it succeeds
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  echo "  database not available yet, sleeping 1s"
  sleep 1
done

echo "Database available, applying migrations"
# use migrate deploy to apply any pending migrations
npx prisma migrate deploy

# run seed script if needed
npm run prisma:seed || true

# finally exec the command given in CMD (defaults to start script)
exec "$@"

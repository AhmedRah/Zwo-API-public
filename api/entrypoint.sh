#!/bin/bash
# Docker entrypoint script.
npm install

# Wait until Postgres is ready
npm run migrate

echo "Lancement Serveur Nodejs"
# exec ls
exec npm run start:dev
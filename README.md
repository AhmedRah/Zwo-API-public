# zwo-backend
![alt text](docs/logo-zwo.png)

## Installation

### 1 - Docker and Task
You can download and install Docker and Docker-compose depending on your platform :

- https://docs.docker.com/install/
- https://docs.docker.com/compose/install/

### 2 - Before you start
At the root of the project, execute the following commands:
 ```bash
## Copy the api .env file
cp ./api/.env.sample ./api/.env
 ```

> **Note**: Change the values in the .env files if necessary.

### 3 - Install dependencies
You can install project using docker compose commands or by just running the following make command:
```bash
## Start project
make start
```

### 4 - Let's run it
If all your containers are up and running. You can connect to your different applications.

API: http://localhost:3000/api/v1 <br/>
Swagger: http://localhost:3000/swagger

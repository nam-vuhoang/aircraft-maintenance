## Installation Instructions

### Clone the repository

```sh
git clone https://github.com/nam-vuhoang/aircraft-maintenance.git
cd aircraft-maintenance
```

### Option 1. Installation with Docker

1. **Ensure you have the following installed on your machine:**

   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker Compose](https://docs.docker.com/compose/install/)

2. **Copy the example environment file and modify it as needed:**

   ```sh
   cp .env.example .env
   ```

   Open the .env file in a text editor and update the configuration as necessary. Here is an example `.env` file:

   ```env
   # Backend configuration
   BACKEND_PORT=3000
   # Log level for backend: debug | info | warn | error
   BACKEND_LOG_LEVEL=info

   # Frontend configuration
   FRONTEND_PORT=5173
   # Log level for frontend: debug | info | warn | error
   FRONTEND_LOG_LEVEL=info

   # Environment configuration: production | development
   NODE_ENV=production

   # Database configuration
   DATABASE_HOST=database
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=aircraft_maintenance
   ```

3. Run Docker Compose to build and start the services:

   ```sh
   docker-compose up --build
   ```

4. Accessing the Services

   - **Frontend (UI):** `http://localhost:5173`.
   - **Backend (Swagger docs):** `http://localhost:3000/api-docs`.

5. Additional commands

   Stopping the services:

   ```sh
   docker-compose down
   ```

   Stopping the services and deleting the data volume:

   ```sh
   docker-compose down -v

   ```

   Rebuilding the services:

   ```sh
   docker-compose up --build
   ```

   Viewing logs:

   ```sh
   docker-compose logs -f
   ```

### Option 2. Installation with yarn (for debugging)

1. **Ensure you have the following installed on your machine:**

   - [Node.js and npm](https://nodejs.org/)
   - [Yarn](https://classic.yarnpkg.com/en/)
   - [PostgreSQL](https://www.postgresql.org/)

2. **Create a new database in PostgreSQL:**

   Ensure you have PostgreSQL running locally and created a database called `aircraft_maintenance`:

   ```sh
    psql -U <admin_user>
   ```

   Create a new database:

   ```sql
   # Create a new database named aircraft_maintenance:
   CREATE DATABASE aircraft_maintenance;

   # Create a new user named new_user with the password password:
   CREATE USER new_user WITH PASSWORD 'some_password';

   # Grant all privileges on the database to the new user:
   GRANT ALL PRIVILEGES ON DATABASE aircraft_maintenance TO new_user;
   ```

3. Install backend:

   Copy `.env.example` to `.env` and modify it as needed:

   ```sh
   cd backend
   cp .env.example .env
   ```

   Open the .env file in a text editor and update the configuration as necessary. Here is an example `.env` file:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=aircraft_maintenance

   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=debug
   NODE_ENV=development
   ```

   Install backend dependencies and run the backend server:

   ```sh
   yarn install
   yarn typeorm:migration:run
   yarn start:dev
   ```

   By default, the backend will be started at http://localhost:3000.

4. Install frontend:

   Copy `.env.example` to `.env` and modify it as needed:

   ```sh
   cd ../frontend
   cp .env.example .env
   ```

   Open the .env file in a text editor and update the configuration as necessary. Here is an example `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_LOG_LEVEL=info
   ```

   Install backend dependencies and run the backend server:

   ```sh
   yarn install
   yarn dev
   ```

   By default, the frontend will be started at http://localhost:5173.

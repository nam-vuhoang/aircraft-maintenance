# psql -U postgres

CREATE DATABASE aircraft_maintenance;


CREATE USER new_user WITH PASSWORD 'password';

GRANT ALL PRIVILEGES ON DATABASE aircraft_maintenance TO new_user;

\q


# psql -U new_user -d aircraft_maintenance

\c aircraft_maintenance

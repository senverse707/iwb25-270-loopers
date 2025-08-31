
# Squid-Verse
<img width="1365" height="635" alt="image" src="https://github.com/user-attachments/assets/b12c24f9-e9fc-4633-a403-0972e886cc1d" />





🎥 Watch our project demo on YouTube: https://www.youtube.com/watch?v=RQOwWGBXc5U


## ***Project Overview***

A fan-made **Squid Game–themed website** featuring user authentication, polls, and interactive game-inspired sections.
- **Backend**:  Ballerina with MySQL for authentication

- **Polls**: Node.js service

- **Frontend**: Integrated with APIs for an immersive Squid Game experience

- Includes **SQL setup scripts**,**REST APIs**, and **frontend integration**.

# Moratuwa Project – Ballerina & MySQL Authentication

This part of the project implements:

- User authentication system with Ballerina and MySQL

- REST APIs for registration and login

- Node.js backend for poll features

## ***Prerequisites***

Before running, install:

- **Ballerina v2201.12.7** → Download here https://ballerina.io/downloads/

- **MySQL** (Workbench or CLI)

- **Node.js** (for poll backend)

## ***Project Structure***
```
MoratuwaProjectBallerina/
│── backend/
│   ├── main.bal              # Ballerina service (auth system)
│   ├── Ballerina.toml        # Project dependencies
│   ├── Config.toml           # Database configuration
│   ├── Dependencies.toml
│   ├── scripts/
│   │   ├── setup.sql         # Initial DB setup
│   │   ├── squidgames_db.sql # Example schema for game DB
│   │   └── test_api.http     # API test collection
│   └── squid-poll-backend/   # Node.js backend for poll feature
│       └── index.js
│
│── frontend/                 # Frontend UI
```
## ***Setup Instructions***
### 1. Extract Project
```
unzip MoratuwaProjectBallerina.zip

cd MoratuwaProjectBallerina/backend
```
### 2. Setup MySQL Database

Run the provided SQL script:
```
CREATE DATABASE squidgames;
USE squidgames;
SOURCE scripts/setup.sql;
```

This will create the required tables (e.g., ```users```).

### 3. Configure Database Credentials

Edit **backend/Config.toml**:
```
[database]
host = "localhost"
port = 3306
user = "root"
password = "your_mysql_password"   # <-- change here
database = "squidgames"
```

Also update **backend/main.bal** if needed:
```
configurable string host = "localhost";
configurable int port = 3306;
configurable string user = "root";
configurable string password = "your_password";  # <-- change here
configurable string database = "squidgames";
```
### 4. Run the Ballerina Service

From the ```backend/``` folder:
```
bal run
```

The service will start at: http://localhost:8080

### 5. API Testing

You can test with ```curl``` or the provided file ```scripts/test_api.http```.

**Register User**
```
curl -X POST http://localhost:8080/register \
-H "Content-Type: application/json" \
-d '{"username":"john","email":"john@example.com","password":"mypassword"}'
```

**Login User**

```
curl -X POST http://localhost:8080/login \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"mypassword"}'
```
### 6. Run Poll Backend (Node.js)

Navigate to the poll service folder:

```
cd backend/squid-poll-backend
npm install
```
Then run:
```
node index.js
```
### Expected API Responses

 ✅ **Success**

```{ "message": "User registered successfully" }```


 ❌**Failure**

```{ "error": "Invalid email or password" }```

### Additional Notes

- Always check``` Config.toml``` for correct DB credentials before running.

- Use``` scripts/test_api.http``` inside VS Code REST Client for quick API testing.

- First-time Node.js setup requires ```npm install```.


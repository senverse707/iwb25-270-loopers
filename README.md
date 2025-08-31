# iwb25-270-loopers
A fan-made Squid Game–themed website featuring user authentication, polls, and interactive game-inspired sections. The backend is powered by Ballerina with a MySQL database, while additional features like polls use Node.js. Includes SQL setup scripts, APIs, and frontend integration to recreate the immersive Squid Game experience online.


# Moratuwa Project – Ballerina & MySQL Authentication

This project implements a **user authentication system** and related APIs using **Ballerina**, **MySQL**, and supporting scripts.  
It also includes Node.js components for poll features.



##  Project Structure


MoratuwaProjectBallerina/
│── backend/
│   ├── main.bal                # Ballerina service (auth system)
│   ├── Ballerina.toml           # Project dependencies
│   ├── Config.toml              # Database configuration
│   ├── Dependencies.toml
│   ├── scripts/
│   │   ├── setup.sql            # Initial DB setup
│   │   ├── squidgames_db.sql    # Example schema for game DB
│   │   └── test_api.http        # API test collection
│   └── squid-poll-backend/      # Node.js backend for poll feature
│   └── index.js
│
│__ frontend      






##  Prerequisites

Before running, install:

- **Ballerina** v2201.12.7 → [Download](https://ballerina.io/downloads/)  
- **MySQL** (Workbench or CLI)  
- **Node.js** (for poll backend)  



##  Setup Instructions

### 1. Extract Project

unzip MoratuwaProjectBallerina.zip
cd MoratuwaProjectBallerina/backend




### 2. Setup MySQL Database

Run the provided SQL script:

sql
CREATE DATABASE squidgames;
USE squidgames;
SOURCE scripts/setup.sql;


This will create the required tables (e.g., `users`).



### 3. Configure Database Credentials

Edit 'backend/Config.toml':

toml
[database]
host = "localhost"
port = 3306
user = "root"
password = "your_mysql_password"
database = "squidgames"

Edit 'backend/main.bal':


### 4. Run the Ballerina Service

From the `backend/` folder:


bal run


The service will start at `http://localhost:8080`.



### 5. API Testing

You can test with **curl** or the provided file `scripts/test_api.http`.

**Example – Register User:**

curl -X POST http://localhost:8080/register      -H "Content-Type: application/json"      -d '{"username":"john","email":"john@example.com","password":"mypassword"}'

**Example – Login User:**

curl -X POST http://localhost:8080/login      -H "Content-Type: application/json"      -d '{"email":"john@example.com","password":"mypassword"}'




### 6.  Run Poll Backend

Navigate to the poll service:


You  must run npm install the first time when open the project.
( Because npm install reads the package.json file and downloads all the dependencies (like Express, dotenv, etc.) that your project needs.)


then you can run:
node index.js




## Expected API Responses

**Success**
json
{ "message": "User registered successfully" }


**Failure**
json
{ "error": "Invalid email or password" }





 

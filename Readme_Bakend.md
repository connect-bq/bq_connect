# 🌐 Connect BQ - Backend API

The central API for the "Connect BQ" smart urban mobility platform. This service manages user authentication, route planning, and citizen alerts using **Node.js**, **Express**, and **MongoDB**.

***

### 📜 Table of Contents

* [System Architecture 🏛️](#system-architecture)
* [Technology Stack 🛠️](#technology-stack)
* [Initial Setup 🚀](#initial-setup)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Environment Variables 🔑](#environment-variables)
* [Available Scripts 📜](#available-scripts)
* [API Documentation 📖](#api-documentation)
* [Database Schema (Models) 🗄️](#database-schema-models)
* [Deployment ☁️](#deployment)

***

### 🏛️ System Architecture

The Connect BQ backend is built as a **RESTful API** using the **Express** framework on **Node.js**.

The flow is as follows:

* The client (Frontend) makes an HTTP request to an endpoint (e.g., `POST /api/users`).
* The Express server receives the request and directs it to the appropriate **router**.
* A **controller** handles the business logic, validating input data.
* The controller interacts with **Mongoose models** to perform **CRUD** operations (Create, Read, Update, Delete) on the **MongoDB Compass** database.
* The API returns a **JSON response** to the client.

***

### 🛠️ Technology Stack

* **Runtime Environment**: Node.js (v18.x or newer)
* **Framework**: Express.js
* **Database**: MongoDB (with the MongoDB Compass tool)
* **Object Data Modeling (ODM)**: Mongoose
* **Environment Variable Management**: `dotenv`
* **Testing**: Jest and MongoDB Memory Server

***

### 🚀 Initial Setup

Follow these steps to set up the project in your local development environment.

#### Prerequisites

* Node.js (v18.x or newer)
* NPM (comes with Node.js)
* Git

#### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/connect-bq/bq_connect.git](https://github.com/connect-bq/bq_connect.git)
    cd bq_connect
    ```

2.  **Install the project dependencies:**

    ```bash
    npm install
    ```

***

### 🔑 Environment Variables

This project requires environment variables to function. Create a file named `.env` in the root of the project and add the following variable:

````

# .env

# Port where the server will run

PORT=3001

# Connection URI to your local MongoDB database

# The database is named 'connect\_bq'

MONGO\_URI="mongodb://localhost:27017/connect\_bq"

````

***

### 📜 Available Scripts

In the `package.json` file, you will find the following scripts:

* `npm start`
    * Starts the application in production mode.
* `npm run dev`
    * Starts the application in development mode using **nodemon**, which automatically restarts the server on file changes.
* `npm test`
    * Runs all project tests.

***

### 📖 API Documentation

The main API endpoints are detailed below.

#### User Management

`POST /users`
* **Description**: Creates a new user.
* **Body (raw JSON)**:
    ```json
    {
      "identity_number": "123456789",
      "username": "Willman",
      "password": "1234",
      "email": "willman@test.com",
      "phone": "123-456-7890",
      "age": 20
    }
    ```
* **Successful Response (201 Created)**:
    ```json
    {
      "identity_number": "123456789",
      "username": "Willman",
      "email": "willman@test.com",
      "phone": "123-456-7890",
      "age": 20,
      "routes_history": [],
      "favorites_routes": [],
      "createdAt": "2025-08-28T12:00:00.000Z",
      "updatedAt": "2025-08-28T12:00:00.000Z"
    }
    ```

`GET /users`
* **Description**: Gets a list of all users.
* **Successful Response (200 OK)**:
    ```json
    [
      {
        "identity_number": "123456789",
        "username": "Willman",
        "email": "willman@test.com",
        "phone": "123-456-7890",
        "age": 20,
        "routes_history": [],
        "favorites_routes": [],
        "createdAt": "2025-08-28T12:00:00.000Z",
        "updatedAt": "2025-08-28T12:00:00.000Z"
      }
    ]
    ```

`GET /users/:id`
* **Description**: Gets a user by their ID.
* **Successful Response (200 OK)**: Returns a user object.

`PUT /users/:id`
* **Description**: Updates a user by their ID.
* **Body (raw JSON)**:
    ```json
    {
      "username": "UpdatedWillman"
    }
    ```
* **Successful Response (200 OK)**: Returns the updated user object.

`DELETE /users/:id`
* **Description**: Deletes a user by their ID.
* **Successful Response (200 OK)**:
    ```json
    {
      "message": "User deleted"
    }
    ```

#### Route History

`PUT /users/:id/addRoute`
* **Description**: Adds a route to a user's history.
* **Body (raw JSON)**:
    ```json
    {
      "route": "RouteExample123"
    }
    ```

`PUT /users/:id/removeRoute`
* **Description**: Removes a route from a user's history.
* **Body (raw JSON)**:
    ```json
    {
      "route": "RouteExample123"
    }
    ```

#### Favorite Routes

`PUT /users/:id/addFavorite`
* **Description**: Adds a route to a user's favorites list.
* **Body (raw JSON)**:
    ```json
    {
      "route": "FavoriteRoute456"
    }
    ```

`PUT /users/:id/removeFavorite`
* **Description**: Removes a route from a user's favorites list.
* **Body (raw JSON)**:
    ```json
    {
      "route": "FavoriteRoute456"
    }
    ```

***

### 🗄️ Database Schema (Models)

We use Mongoose to define the schema for our data.

#### Model: `User` (`models/user-model.js`)

```javascript
const userSchema = new mongoose.Schema({
  identity_number: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  favorites_routes: { type: [String], default: [] },
  routes_history: { type: [String], default: [] },
});
````

-----

### ☁️ Deployment

This project is configured for a straightforward deployment on platforms like Vercel or Railway.

#### Vercel

1.  Connect your GitHub repository to your Vercel account.
2.  Import the project. Vercel will detect that it is a Node.js project.
3.  Add the environment variables (`MONGO_URI`) in the project settings.
4.  Deploy. Vercel will handle the rest.

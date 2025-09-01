# 🌐 Connect BQ

**Connect BQ** is a smart urban mobility platform designed to modernize public transport in Barranquilla. It offers citizens a centralized tool to plan routes, receive real-time alerts, and access personalized features.

-----
### 📜 Table of Contents

1. [The Project Team](#the-project-team)
2. [Project Status & License](#project-status--license)
3. [Frontend Documentation](#frontend-documentation)
   * [Key Features](#-key-features)
   * [System Architecture](#-system-architecture)
   * [Tech Stack](#-tech-stack)
   * [Installation and Setup](#-installation-and-setup)
   * [Implemented Views](#-implemented-views)
   * [Upcoming Improvements](#-upcoming-improvements)
4. [Backend Documentation](#backend-documentation)
   * [System Architecture](#-system-architecture-1)
   * [Technology Stack](#-technology-stack)
   * [Initial Setup](#-initial-setup)
     * [Prerequisites](#prerequisites)
     * [Installation](#installation)
   * [Environment Variables](#-environment-variables)
   * [Available Scripts](#-available-scripts)
   * [API Documentation](#-api-documentation)
   * [Database Schema (Models)](#-database-schema-models)
   * [Deployment](#-deployment)
5. [Complete Technical Document](#complete-technical-document)


-----

### The Project Team 👥

This project was developed by the following team:

  * **Sebastian Linero** - *Product Owner & Scrum Master*
  * **Willman Giraldo** - *QA & Backend Developer*
  * **Samuel Arenas** - *Backend Developer*
  * **Santiago Comas** - *Frontend Developer*
  * **Felipe Palmar** - *Frontend Developer*

-----

### Project Status & License 📝

  * **Status:** The project is currently in **beta phase** and represents the **MVP (Minimum Viable Product)**.
  * **License:** This project is licensed under the **GNU General Public License v3.0**.

-----

### Frontend Documentation

This repository contains the web interface for **Connect BQ**, a platform designed to modernize urban mobility in Barranquilla. The frontend offers an intuitive and responsive experience, developed with **HTML5, CSS (Tailwind)**, and **JavaScript (ES6+)**, with **Vite** support for fast development.

The main purpose is to provide citizens with a **centralized digital tool to efficiently plan public transport routes**, with the ability to receive **real-time alerts about route changes**, check mobility information, and access personalized sections through an **interactive dashboard**.

#### 🚀 Key Features

  * 📌 **Multiple views**: login, register, about, dashboard, errors (401, 404, 500).
  * 🎨 **Responsive UI** built with TailwindCSS.
  * 🗺️ **Leaflet.js** for map and route visualization.
  * 📡 API consumption using `fetch`.
  * ⚡ Optimized deployment on **Vercel** with **Vite** bundling.

#### 🏗️ System Architecture

The application is organized as a **MPA (Multi-Page Application)** where each view has its own HTML and associated JS.

```
src/
├── assets/ # Images and icons
├── css/ # Global styles and Tailwind
├── pages/ # Main views
│ ├── about/ # About view
│ ├── dashboard/ # User dashboard view
│ ├── login/ # Login + logic
│ ├── register/ # Register + logic
│ └── errors/ # Error pages (401, 404, 500)
├── index.html # Initial page
├── main.js # Global initialization
└── package.json # Dependencies configuration
```

#### 🛠️ Tech Stack

  * **Frontend**: HTML5, TailwindCSS, JavaScript (ES6+).
  * **Libraries**: Leaflet.js for maps and routes.
  * **Dev tools**: Vite, Node.js, npm.
  * **Deployment**: Vercel.

#### ⚙️ Installation and Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/tu-org/connect-bq-frontend.git
    cd connect-bq-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development environment with Vite:
    ```bash
    npm run dev
    ```
4.  Open in browser:
    ```bash
    http://localhost:5173
    ```

#### 🌍 Implemented Views

  * **Register**: user registration form.
  * **Login**: authentication with validation.
  * **About**: project description.
  * **Dashboard**: main panel with map integration.
  * **Errors (401, 404, 500)**: custom status screens.

#### 🔔 Upcoming Improvements

  * Direct connection to the backend (authentication and routes API).
  * **Real-time data integration**: Displaying real-time GPS location of buses on the map.
  * **Progressive Web App (PWA)**: Allowing users to "install" the application on their mobile devices and access it offline.
  * Better modularization of reusable components.

-----

### Backend Documentation

The central API for the **"Connect BQ"** smart urban mobility platform. This service manages user authentication, route planning, and citizen alerts using **Node.js**, **Express**, and **MongoDB**.

#### 🏛️ System Architecture

The Connect BQ backend is built as a **RESTful API** using the **Express** framework on **Node.js**.

The flow is as follows:

  * The client (Frontend) makes an HTTP request to an endpoint (e.g., `POST /api/users`).
  * The Express server receives the request and directs it to the appropriate **router**.
  * A **controller** handles the business logic, validating input data.
  * The controller interacts with **Mongoose models** to perform **CRUD** (Create, Read, Update, Delete) operations on the **MongoDB** database.
  * The API returns a **JSON response** to the client.

#### 🛠️ Technology Stack

  * **Runtime Environment**: Node.js (v18.x or newer)
  * **Framework**: Express.js
  * **Database**: MongoDB (with MongoDB Compass as a management tool)
  * **Object Data Modeling (ODM)**: Mongoose
  * **Environment Variable Management**: `dotenv`
  * **Testing**: Jest and MongoDB Memory Server

#### 🚀 Initial Setup

Follow these steps to set up the project in your local development environment.

1.  **Prerequisites**

      * Node.js (v18.x or newer)
      * NPM (comes with Node.js)
      * Git

2.  **Installation**

      * **Clone the repository:**
        ```bash
        git clone https://github.com/connect-bq/bq_connect.git
        cd connect-bq-frontend
        ```
      * **Install project dependencies:**
        ```bash
        npm install
        ```

#### 🔑 Environment Variables

This project requires environment variables to function. Create a file named `.env` in the root of the project and add the following variable:

```bash
# .env

# Port where the server will run
PORT=3001

# Connection URI to your local MongoDB database
# The database is named 'connect_bq'
MONGO_URI="mongodb://localhost:27017/connect_bq"
```

#### 📜 Available Scripts

In the `package.json` file, you will find the following scripts:

  * `npm start`: Starts the application in production mode.
  * `npm run dev`: Starts the application in development mode using **nodemon**, which automatically restarts the server on file changes.
  * `npm test`: Runs all project tests.

#### 📖 API Documentation

The main API endpoints are detailed below.

**User Management**

  * `POST /users`: Creates a new user.
  * `GET /users`: Gets a list of all users.
  * `GET /users/:id`: Gets a user by their ID.
  * `PUT /users/:id`: Updates a user by their ID.
  * `DELETE /users/:id`: Deletes a user by their ID.

**Route History**

  * `PUT /users/:id/addRoute`: Adds a route to a user's history.
  * `PUT /users/:id/removeRoute`: Removes a route from a user's history.

**Favorite Routes**

  * `PUT /users/:id/addFavorite`: Adds a route to a user's favorites list.
  * `PUT /users/:id/removeFavorite`: Removes a route from a user's favorites list.

**Alerts Management**

  * `POST /alerts`: Creates a new alert in the system.
  * `GET /alerts`: Retrieves all active alerts in the system.

#### 🗄️ Database Schema (Models)

We use Mongoose to define the schema for our data.

  * **Model**: `User` (`models/user-model.js`)
  * **Model**: `Alert` (`models/alert-model.js`)

#### ☁️ Deployment

This project is configured for a straightforward deployment on platforms like Vercel or Railway.

1.  Connect your GitHub repository to your Vercel account.
2.  Import the project. Vercel will detect that it is a Node.js project.
3.  Add the environment variables (`MONGO_URI`) in the project settings.
4.  Deploy. Vercel will handle the rest.

-----

### Complete Technical Document

For a detailed description of the project's architecture, methodology, challenges, and future improvements, please refer to the complete technical document.
# Food Waste Management Platform

Food Waste Management Platform is a full-stack web application for managing food donations, user and admin accounts, shopping-related records, and food-awareness content. The project combines a Spring Boot backend with a React + Vite frontend and is designed to run locally or through Docker.

## Overview

The application provides two main experiences:

- A user-facing portal for registration, login, donation posting, donation browsing, profile management, shopping data, and recipe/awareness pages.
- An admin-facing portal for managing users, admins, and donation records.

The backend uses session-based authentication and exposes REST endpoints for the frontend. The frontend talks to the API through Axios with credentials enabled so login sessions can be maintained with cookies.

## Features

- User registration and login
- Admin registration and login
- Session-based authentication and logout
- Create, view, update, and delete food donations
- View donations created by a specific donor
- Manage users and admins through dedicated admin screens
- Create, view, update, and delete shopping-data records
- Donation dashboard, profile pages, and awareness content
- Recipes and other supporting informational pages

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.3.9
- Spring Web
- Spring Data JPA
- MySQL
- Maven

### Frontend

- React 18
- Vite
- React Router
- Axios
- Bootstrap
- Framer Motion
- Chart.js / react-chartjs-2

### DevOps / Runtime

- Docker
- Docker Compose

## Project Structure

```text
food_rescue_hub/
├── docker-compose.yml
├── food/                 # Spring Boot backend
│   ├── src/main/java/spr/food/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── food-frontend/        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Frontend Routes

The React app defines the following main routes:

- `/` - Home
- `/login` - User login
- `/signup` - User registration
- `/profile` - User profile
- `/donations` - Donation list
- `/addDonations` - Create a donation
- `/mydonations` - User donation list
- `/editDonation/:id` - Edit a donation
- `/about` - About page
- `/user` - Awareness section
- `/logout` - Logout
- `/shopping-details` - Shopping data view
- `/homepage` - Landing/home page variant
- `/dashboard` - Dashboard
- `/additems` - Add shopping items
- `/make-recipes` - Recipes page
- `/admin-login` - Admin login
- `/admin-signup` - Admin registration
- `/admin-dashboard` - Admin dashboard
- `/admin-profile` - Admin profile
- `/admin-donations` - Admin donation list
- `/admin-donations/edit/:id` - Edit donation as admin
- `/user-management` - Admin user management
- `/admin-users/edit/:id` - Edit user as admin

## Backend API

The backend exposes these REST endpoints:

### Authentication

- `POST /auth/user/login`
- `POST /auth/admin/login`
- `POST /auth/user/register`
- `POST /auth/admin/register`
- `POST /auth/logout`
- `GET /auth/status`
- `GET /auth/user/details`
- `GET /auth/admin/details`

### Users

- `POST /users`
- `GET /users`
- `GET /users/{id}`
- `PUT /users/{id}`
- `DELETE /users/{id}`

### Admins

- `POST /admins`
- `GET /admins`
- `GET /admins/{username}`
- `PUT /admins/{username}`
- `DELETE /admins/{username}`

### Food Donations

- `POST /donations`
- `GET /donations`
- `GET /donations/{id}`
- `GET /donations/donor/{donorId}`
- `PUT /donations/{id}`
- `DELETE /donations/{id}`

### Shopping Data

- `POST /shopping-data`
- `GET /shopping-data`
- `GET /shopping-data/{id}`
- `GET /shopping-data/user/{userId}`
- `PUT /shopping-data/{id}/user/{userId}`
- `DELETE /shopping-data/{id}/user/{userId}`

## Prerequisites

Make sure you have the following installed:

- Java 17
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8+
- Docker and Docker Compose if you want container-based startup

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AbhinavRaj1311/Food-Waste-Management-Platform.git
cd food_rescue_hub
```

### 2. Configure the backend database

Update `food/src/main/resources/application.properties` with your local MySQL settings if needed.

The backend currently expects:

- Port: `8080`
- Database: `test`
- MySQL host: `host.docker.internal` when running from Docker

If you are running everything locally without Docker, point the datasource URL to your local MySQL instance and make sure the database exists.

### 3. Start the backend

```bash
cd food
mvn spring-boot:run
```

The backend should start on `http://localhost:8080`.

### 4. Start the frontend

Open a second terminal:

```bash
cd food-frontend
npm install
npm run dev
```

The frontend should run on `http://localhost:3000` or the port shown by Vite.

## Docker Setup

You can run both services with Docker Compose from the repository root:

```bash
docker compose up --build
```

This starts:

- Backend on `http://localhost:8080`
- Frontend on `http://localhost:3000`

## Important Runtime Notes

- The application uses session cookies for login state.
- The frontend Axios client is configured with `withCredentials: true`.
- The backend allows the frontend origin at `http://localhost:3000`.
- User and admin passwords are handled in the current project logic as plain string comparisons, so this codebase is best treated as a functional prototype unless you add proper password hashing.

## Development Notes

- Backend entry point: `food/src/main/java/spr/food/FoodApplication.java`
- Frontend entry point: `food-frontend/src/main.jsx`
- Main router: `food-frontend/src/App.jsx`
- API client: `food-frontend/src/components/api.jsx`

## Troubleshooting

- If login fails, confirm that the backend is running and the database is reachable.
- If the frontend cannot reach the backend, verify the backend URL in the Axios client and any CORS settings.
- If Docker Compose fails, make sure port `8080` and `3000` are free and MySQL is available as configured.

## License

This repository currently includes a `LICENSE` file in the root. Refer to that file for the applicable license terms.

# Odoo Hackathon 2026

## Team Members
- Bhargav Sharma
- ANKIT RAJ
- YASH ROTE

## Problem Statement
Traveloop


## Project Overview
The Travel Itinerary Planner is a full-stack web application designed to streamline trip organization. It allows users to securely manage their travel plans, build detailed daily itineraries, and store personal travel notes within a responsive dashboard.

## Feature List
* **Secure Authentication:** User registration and login using JWT-based authorization.
* **Dashboard Management:** Centralized view of recent activities, trip statistics, and active plans.
* **Trip Organization:** Full CRUD operations for managing trips and destinations.
* **Interactive Timeline:** Dynamic itinerary builder to schedule daily activities and locations.
* **Travel Notes:** Dedicated note-taking system for specific trips.
* **Responsive UI:** Optimized experience for both desktop and mobile devices.

## Tech Stack
* **Frontend:** React.js, Vite, CSS3
* **Backend:** Node.js, Express.js
* **Database:** SQL
* **Authentication:** JSON Web Tokens (JWT) & bcrypt


## Setup Instructions

**1. Clone the repository**
\`\`\`bash
git clone <repository-url>
cd odoo-hackathon-2026
\`\`\`

**2. Database Initialization**
* Run your SQL server.
* Execute the scripts in the `/database` folder (`schema.sql` and `seed.sql`) to set up the tables.

**3. Backend Setup**
\`\`\`bash
cd server
npm install
# Configure your .env file based on .env.example
npm start
\`\`\`

**4. Frontend Setup**
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## API Overview
The backend provides RESTful endpoints:
* **`/api/auth`**: User registration, login, and validation.
* **`/api/trips`**: Trip creation, retrieval, updates, and deletion.
* **`/api/trips/:tripId/itinerary`**: Manage timeline events for a specific trip.
* **`/api/trips/:tripId/notes`**: Add or modify personal notes for a trip.

## Database Overview
Relational database structure ensuring data integrity:
* **Users:** Authenticated credentials.
* **Trips:** Core trip details (destination, dates).
* **TripItineraries:** Scheduled timeline events linked to trips.
* **TripNotes:** Text notes linked to specific trips.
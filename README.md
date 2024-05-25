# aeroguide-backend
# Enhancing Flight Navigation Mechanism for Optimal Route Planning and Risk Mitigation

## Introduction
In the aviation industry, ensuring safe and efficient flight navigation is paramount. With the goal of minimizing human errors and enhancing automated navigation mechanisms, this project aims to develop a comprehensive solution that addresses various challenges encountered during flight navigation. These challenges include unavailable GPS signals, adverse weather conditions such as fog, smoke, rain, snow, noise, electronic failures, and varying pressures due to weather conditions and altitude changes.

## Objective
The primary objective is to design, develop, and implement a robust software solution that leverages existing algorithms to identify optimal flight paths considering the aforementioned challenges. Additionally, the solution should provide real-time risk assessment and suggest alternative routes to pilots, airlines, and airport authorities for safe and efficient navigation. Integration of a real-time health metrics tracker based on flight sensor data could also be useful to understand flight health.

## Key Components and Requirements

### Data Collection and Management
for Data Collection, We have used below APIs to get the data sync and used as sample data.

#### APIs References for Sample Datasets:
- [Aviation Stack API](https://aviationstack.com)
- [Open Meteo API](https://open-meteo.com/)
- [Amadeus API](https://developers.amadeus.com/self-service/category/flights/api-doc/airport-nearest-relevant)

### Scenario Identification
- Optimal Path Routing: The system evaluates various factors, including weather conditions, air traffic, and navigational constraints, to plan the most efficient and safe flight path from departure to destination.
- Risk Handling: The solution assesses real-time data to identify potential risks such as adverse weather conditions, electronic failures, and navigational hazards. It then provides alerts and mitigation strategies to pilots and control centers.
- Emergency Path Routing: In the event of an identified risk or emergency, the system can suggest alternative routes that minimize risk and ensure the safety of the flight. This includes rerouting due to severe weather conditions, GPS signal loss, or system failures.

### Route Planning Algorithm
We have implemented the route planning algorithm to find the best navigation path considering the identified scenarios and challenges. The algorithm prioritizes safety, efficiency, and reliability in route selection. The implementation details can be found in the repository link below:
- [Route Planning Algorithm Repository](https://github.com/Aerothon-6-0/aeroguide-algorithm)

### User Interface and Dashboard
We have implemented a user-friendly interface that displays optimal flight routes along with associated risks and challenges. A dashboard provides real-time updates and alerts on weather conditions, environmental factors, and system status to aid decision-making. The implementation details can be found in the repository link below:
- [User Interface and Dashboard](https://github.com/Aerothon-6-0/aeroguide-frontend)

## Project Details

### Data Sources
- Aviation Stack API for data synchronization.
- Open Meteo for weather reports.

### Tech Stack
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Hosting**: Render
- **Database Hosting**: Supabase

## Installation and Setup

### Prerequisites
- Node.js
- npm or yarn
- PostgreSQL database
- Supabase account for database hosting
- Render account for server hosting

### Steps to Run the Project

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Aerothon-6-0/aeroguide-backend.git
   cd aeroguide-backend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your API keys and database connection details.
   ```env
   AVIATIONSTACK_API_KEY=your_aviationstack_api_key
   DATABASE_URL=your_database_url
   AMADEUS_API_KEY= your_amadeus_api_key
   AMADEUS_API_SECRET= your_amadeus_secret_key
   
   ```

4. **Run database migrations**:
   ```sh
   npx prisma migrate deploy
   ```

5. **Start the server**:
   ```sh
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage
- The user interface provides real-time updates on weather conditions, flight routes, and potential risks.
- The dashboard allows pilots and control centers to make informed decisions based on current data.

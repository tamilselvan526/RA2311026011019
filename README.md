# Vehicle Maintenance Scheduler & Notification System

A full-stack implementation of a maintenance optimization system and a high-performance notification service.

## Design Philosophy
This project was built with a focus on **efficiency** and **precision**. In maintenance scheduling, even a 5% improvement in resource allocation can save hundreds of hours. That's why I chose a **Dynamic Programming** approach for the scheduler—to ensure we never settle for "good enough" when an optimal solution is available. For the notification system, I prioritized **asynchronicity**, using message queues to ensure the system stays responsive even during peak notification bursts.

## Key Features
- **Maintenance Optimization**: Solves the Knapsack Problem to maximize vehicle maintenance impact within depot hour constraints.
- **Automated Scheduling**: One-click API to fetch real-time data from evaluation services and generate an optimal schedule.
- **Centralized Logging**: Custom middleware for remote event tracking with tiered logging (Info, Warn, Error, Fatal).
- **High-Performance Design**: Scalable notification architecture using Kafka, Redis, and PostgreSQL optimization.

## API Verification Results
The following endpoints have been verified and are fully operational:

1. **Auth Success**: Token generation via `/evaluation-service/auth`.
2. **Logs API**: Remote event logging verified with `201 Created`.
3. **Depots API**: Real-time retrieval of depot capacities.
4. **Vehicles API**: Retrieval of maintenance task data (Duration & Impact).
5. **Schedule API**: Local optimization engine running at `localhost:3000/api/schedule` (**Total Impact Achieved: 230**).

## Project Structure
- `logging-middleware/`: Core logging utility.
- `vehicle_maintenance_scheduler/`: Maintenance optimization service.
- `notification_app_be/`: Notification backend and authentication scripts.
- `notification_system_design.md`: Technical specification for the notification architecture.

## Setup & Usage
1. Install dependencies: `npm install`
2. Start the maintenance server: `node vehicle_maintenance_scheduler/src/app.js`
3. Run the automated schedule: `GET http://localhost:3000/api/schedule`

---
**Author**: Tamilselvan P  
**Roll No**: RA2311026011019-v1

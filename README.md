## Video link-> https://drive.google.com/file/d/1AC2x1B47qsx7gNHJDJMBhUoW1nhr_XNa/view?usp=sharing

# Fleet Management System

## Overview

This Fleet Management System is a web application designed to manage and optimize the assignment of drivers to vehicles in a fleet operation. The system provides functionalities for driver creation, vehicle-driver assignment, time scheduling, conflict handling, driver assignment requests, and location-based driver search.

## Features

### Level 0: Basic Driver Creation and Vehicle-Driver Assignment

- Create and store driver profiles through a web UI form
- Search drivers by name and phone
- Assign drivers to vehicles (one driver per vehicle at a time)
- Store and retrieve vehicle information
- Manual assignment and un-assignment of drivers to vehicles

### Level 1: Time Scheduling and Assignment Conflict Handling

- Time-bound assignments (from timestamp A to timestamp B)
- Prevention of overlapping assignments

### Level 2: Driver Assignment Requests and Acceptance

- Drivers can receive assignment requests
- Drivers can accept or reject assignment requests
- Multiple drivers can receive the same request, but only one can accept
- Real-time update of assignment status

### Level 3: Driver Search and Assignment Based on Location

- Search for available drivers based on proximity to a location
- Driver location is fixed and set during enrollment
- Location-based driver search considering availability and scheduling conflicts

### Bonus Features

- Dashboard with high-level metrics
- Maps UI to visualize available drivers based on location
- Display of top N booked vehicles for day, week, and month
- Work hours definition for drivers during enrollment

## Project Structure
```
.
├── (auth)
│ ├── signin
│ │ └── page.tsx
│ └── signup
│ └── page.tsx
├── (root)
│ ├── (home)
│ │ └── page.tsx
│ ├── assignment_req
│ │ └── page.tsx
│ ├── dashboard
│ │ └── page.tsx
│ ├── layout.tsx
│ ├── saveDetails
│ │ ├── dashboard
│ │ │ └── page.tsx
│ │ └── page.tsx
│ ├── search-drivers
│ │ └── page.tsx
│ ├── unassign
│ │ └── page.tsx
│ └── vehicleToDriver
│ └── page.tsx
├── api
│ └── auth
│ └── [kindeAuth]
│ └── route.ts
├── favicon.ico
├── globals.css
└── layout.tsx

```

## Key Components

1. **Authentication**: Handled in the `(auth)` folder with signin and signup pages.
2. **Home**: The main landing page in `(root)/(home)/page.tsx`.
3. **Assignment Requests**: Managed in `assignment_req/page.tsx`, allowing drivers to accept or reject vehicle requests.
4. **Dashboard**: Located in `dashboard/page.tsx`, used for editing profiles and viewing metrics.
5. **Driver Search**: Implemented in `search-drivers/page.tsx` for finding drivers near a specific location.
6. **Vehicle Assignment**:
   - `vehicleToDriver/page.tsx` for admin to assign vehicles or send requests to drivers.
   - `unassign/page.tsx` for admin to unassign vehicles from drivers.
7. **API**: Authentication API route in `api/auth/[kindeAuth]/route.ts`.

## Entities

### Driver Entity
- Driver ID (unique identifier)
- Name
- Email
- Phone
- Location (optional, used in Level 3)
- assignments
- assignment_request

### Vehicle Entity
- Vehicle ID (unique identifier)
- brand
- model_name
- License Plate
- status
- available 


## Technologies Used
Nextjs, mongodb, typescript 






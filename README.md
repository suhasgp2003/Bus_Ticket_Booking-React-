# Bus Ticket Booking System

A modern bus ticket booking application built with React for the frontend and Django REST Framework for the backend. Users can browse available buses, view details, book seats, and manage their bookings securely.

## Overview

This project is designed to simulate a real-world bus ticket booking platform with a clean and user-friendly interface. It demonstrates full-stack development, including:
- frontend UI and routing
- backend REST APIs
- authentication and authorization
- seat booking logic
- database design
- API integration

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router DOM
- Tailwind CSS

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- Token-based authentication

## Features

- Register and login users
- Browse available buses
- View route, timing, price, and features
- Select available seats
- Book multiple seats in one transaction
- Prevent duplicate or already-booked seats
- Cancel existing bookings
- View personal booking history
- Secure API access with authentication

## Project Structure

```bash
Bus_Ticket_Booking-React-
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── index.html
└── eslint.config.js
```

## Prerequisites

Before running this project, make sure you have:
- Node.js installed
- npm or yarn
- A working backend API running on localhost:8000

## Installation

1. Clone the repository
```bash
git clone https://github.com/suhasgp2003/Bus_Ticket_Booking-React-.git
cd Bus_Ticket_Booking-React-
```

2. Install dependencies
```bash
npm install
```

3. Start the frontend development server
```bash
npm run dev
```

4. Open the app in your browser
```bash
http://localhost:5173/
```

## Environment Configuration

Create a `.env.local` file if needed for API configuration:

```env
VITE_API_URL=http://localhost:8000
```

## API Integration

The frontend communicates with the backend through HTTP requests using Axios. It interacts with endpoints such as:
- user registration
- login
- bus listing
- booking creation
- booking cancellation
- user booking history

## Usage Flow

1. User registers or logs in
2. User selects a bus from the available list
3. User chooses seat(s)
4. User confirms booking
5. Booking is saved to the backend database
6. User can view or cancel their bookings later

## Screenshots

Add screenshots here to showcase the UI:
- Home page
- Bus list page
- Seat selection page
- Booking confirmation page
- User booking history

## Future Improvements

- Payment gateway integration
- Search and filter buses by date and route
- Better seat visualization
- User profile page
- Admin dashboard
- Booking history filters and sorting
- Improved error handling and UI validation

## Learning Outcomes

This project demonstrates:
- React app structure and component-based UI design
- REST API consumption using Axios
- Stateful UI and form handling
- Route-based navigation
- Frontend-backend integration
- Real-world project workflow for full-stack development

## Author

Suhas G P

GitHub: https://github.com/suhasgp2003

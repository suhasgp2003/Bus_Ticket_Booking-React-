# Bus Ticket Booking System - GoBus

A modern bus ticket booking application built with React and Vite for the frontend, integrated with a Django REST API backend. The app allows travelers to register, log in, browse available buses, select seats, confirm bookings, and view their booking history in a clean and responsive interface.

## 🚀 Live Deployment

- **Frontend (Vercel):** [Visit Live App](https://bus-ticket-booking-react.vercel.app)
- **Backend (Render):** [API Endpoint](https://bus-ticket-booking-backend-zbwn.onrender.com)

## Overview

This project simulates a real-world bus booking platform with full-stack functionality. The frontend provides a user-friendly experience for searching and booking tickets, while the backend handles authentication, bus information, bookings, and seat management.

## Tech Stack

### Frontend
- React 19
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS
- **Deployed on:** Vercel

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- Token-based authentication
- **Deployed on:** Render

## Key Features

- ✅ User registration and login with secure authentication
- ✅ Dashboard overview after login
- ✅ Browse available buses and routes
- ✅ View bus details, timings, seat availability, and pricing
- ✅ Select and reserve seats interactively
- ✅ Book multiple seats in a single transaction
- ✅ Prevent invalid or duplicate seat bookings
- ✅ View personal booking history
- ✅ Cancel existing bookings
- ✅ Light/Dark theme toggle
- ✅ Responsive and modern UI
- ✅ Production-ready with CI/CD pipelines

## Project Structure

```bash
Bus_Ticket_Booking-React-
├── src/
│   ├── components/
│   │   ├── BusList.jsx            # Browse available buses
│   │   ├── BusSeats.jsx           # Seat selection interface
│   │   ├── Dashboard.jsx          # User dashboard
│   │   ├── LoginForm.jsx          # Login page
│   │   ├── RegisterForm.jsx       # Registration page
│   │   ├── UserBookings.jsx       # Booking history
│   │   ├── Wrapper.jsx            # Layout wrapper with navbar
│   │   ├── Toast.jsx              # Notifications
│   │   └── ConfirmationDialog.jsx # Confirmation modals
│   ├── App.jsx                    # Main app routes
│   ├── main.jsx                   # Entry point
│   ├── App.css
│   ├── index.css
│   └── ...
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
├── README.md
└── .env.development
```

## Prerequisites

Before running the frontend locally, make sure you have:

- Node.js 18+ installed
- npm or yarn
- Internet connection for backend API access (or local backend running)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/suhasgp2003/Bus_Ticket_Booking-React-.git
cd Bus_Ticket_Booking-React-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
# For production, use your Render backend URL:
# VITE_API_URL=https://your-render-backend-url.onrender.com
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the app in your browser

```bash
http://localhost:5173
```

## Backend Setup

This frontend is designed to work with the backend repository:

**GitHub:** https://github.com/suhasgp2003/Bus_Ticket_Booking-Backend-

**Render Deployment:** https://your-render-backend-url.onrender.com

### Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register/` | POST | User registration |
| `/api/auth/login/` | POST | User login |
| `/api/buses/` | GET | Fetch all buses |
| `/api/buses/{id}/` | GET | Get bus details |
| `/api/seats/{busId}/` | GET | Get available seats |
| `/api/bookings/` | GET, POST | List/create bookings |
| `/api/bookings/{id}/` | DELETE | Cancel booking |

## Environment Configuration

### Frontend (.env.local)

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

The app uses local storage for:
- Authentication tokens
- User ID and username
- Theme preference (light/dark)

## Available Scripts

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint checks
```

## App User Flow

1. **Authentication:** User registers or logs in
2. **Dashboard:** User lands on the dashboard with navigation options
3. **Browse Buses:** User explores available buses and routes
4. **Select Seats:** User picks available seats for a specific bus
5. **Confirm Booking:** User completes the booking transaction
6. **Manage Bookings:** User can view or cancel bookings later
7. **Theme Toggle:** User can switch between light and dark modes

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variable `VITE_API_URL` in Vercel dashboard
4. Deploy automatically on every push to `main`

### Backend (Render)

1. Connect your GitHub repo to Render
2. Configure environment variables (database, secret keys, etc.)
3. Deploy as a Web Service
4. Update `VITE_API_URL` in frontend with Render URL

## Screenshots

Add screenshots of the following features:
- Login & Registration pages
- Dashboard overview
- Bus listing with filters
- Seat selection interface
- Booking confirmation
- User booking history
- Dark mode toggle

## Future Improvements

- 🔐 Payment gateway integration (Razorpay, Stripe)
- 🔍 Advanced search and filter by route/date/price
- 🗺️ Better seat map visualizations
- 📊 Admin dashboard for bus and booking management
- 📈 Booking analytics and reports
- 🔔 Real-time notifications
- 💬 Customer support chat
- ⭐ User reviews and ratings
- 📱 Mobile app (React Native)
- 🚀 WebSocket integration for live seat updates

## Learning Outcomes

This project demonstrates:

- React 19 with hooks and functional components
- React Router v7 for navigation
- API integration with Axios
- Form handling and validation
- State management and local storage
- Responsive design with CSS
- Full-stack development workflow
- Git and GitHub collaboration
- Deployment pipelines (Vercel + Render)

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure your backend has `CORS_ALLOWED_ORIGINS` configured to include your frontend URL.

### Token Expired
The app stores tokens in localStorage. Clear localStorage if you encounter authentication issues:
```javascript
localStorage.clear()
```

### Backend Connection Failed
1. Check if backend is running on configured URL
2. Verify `VITE_API_URL` environment variable
3. Check browser console for detailed error messages
4. Ensure backend is not on localhost if frontend is deployed

## Contributing

Feel free to fork this repository and contribute improvements via pull requests.

## Author

**Suhas G P**

- GitHub: https://github.com/suhasgp2003
- Portfolio: [Add your portfolio link]

## License

This project is provided for educational and portfolio use. Consider adding an appropriate license (MIT, Apache, etc.) if publishing publicly.

---

**Last Updated:** October 2026

For questions or issues, please create a GitHub issue in the repository.

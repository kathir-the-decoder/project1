# Tour Explorer Backend API

Complete backend API for the Tour Explorer travel booking application.

## Features

- 🔐 User Authentication (JWT)
- 🏝️ Tour Management (100+ destinations)
- 📅 Booking System
- 📧 Enquiry Management
- 📊 Dashboard Statistics
- 👤 User Management

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB
Make sure MongoDB is running on your system:
- **Local**: `mongodb://localhost:27017`
- **Or use MongoDB Atlas** (update `.env` file)

### 3. Seed Database
```bash
node seed.js
```
This creates:
- 100 tour packages
- Admin user: `admin@tourexplorer.com` / `admin123`
- Test user: `user@example.com` / `user123`

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |

### Tours
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tours` | Get all tours |
| GET | `/api/tours/:id` | Get single tour |
| POST | `/api/tours` | Create tour (admin) |
| PUT | `/api/tours/:id` | Update tour (admin) |
| DELETE | `/api/tours/:id` | Delete tour (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get single booking |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id/status` | Update status |
| DELETE | `/api/bookings/:id` | Cancel booking |

### Enquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enquiries` | Get all enquiries |
| POST | `/api/enquiries` | Submit enquiry |
| PATCH | `/api/enquiries/:id/status` | Update status |
| DELETE | `/api/enquiries/:id` | Delete enquiry |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Dashboard stats |
| GET | `/api/stats/bookings` | Booking stats |
| GET | `/api/stats/tours` | Tour stats |

## Environment Variables

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tour-explorer
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Contact

📞 +91 90809 01058
✉️ info@tourexplorer.com

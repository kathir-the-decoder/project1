Tour Booking Application

Full-stack tour booking application with React frontend and Node.js/Express backend.

## Features

- Browse and search tours
- Filter by price, rating, duration.
- Book tours with detailed form
- User authentication
- Admin panel for managing tours
- MongoDB database
- RESTful API

## Quick Start

### Backend Setup

1. Install MongoDB (https://www.mongodb.com/try/download/community)

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Seed the database:
```bash
node seed.js
```

4. Start backend server:
```bash
npm run dev
```
Backend runs on http://localhost:5000

### Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Start React app:
```bash
npm start
```
Frontend runs on http://localhost:3000

## Project Structure

```
tour-frontend/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── seed.js          # Database seeder
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   └── App.js           # Main app
└── package.json
```

## API Documentation

See `backend/README.md` for detailed API documentation.

## Technologies

**Frontend:**
- React 19
- Axios
- CSS3

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Environment Variables

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tour-app
JWT_SECRET=your_secret_key
```

# HealthHive Setup Guide

This guide will help you set up and run the HealthHive application locally.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- Git

## Project Structure

```
HealthHive/
├── Doctor/           # Frontend Next.js application
├── Doctor-Backend/   # Backend Node.js/Express API
├── README.md
└── SETUP.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PhemeloDev/Docter.git HealthHive
cd HealthHive
```

### 2. Backend Setup

```bash
cd Doctor-Backend

# Install dependencies
npm install

# Create environment file
# Copy the MongoDB URI and JWT secret from the README.md
echo "MONGO_URI=mongodb+srv://sspegah:kdgShXHvlSY47T0y@cluster0.s9pmg.mongodb.net/HealthHive?retryWrites=true&w=majority" > .env
echo "JWT_SECRET=97f25b9fd264231f373cfdbb5592406c1ebe14938105ea35163d6213a815f578d9cb7b92e9964accb354ad28cfd0fcb099dc77894fac6ab0b7a7fbb2af6a12184cfa6caf5189bcec1ceacd2fd9164baf178e26eeee76ddc775cbe07d51875c7b6e9d2f725cc6907a16b9b99dd2db3a396b30f07166752d859827f35e3af46ed43ff8eb4a89e8e68318c04b5682601359031f0480dc04eab06fe7c5806d17d636f295c43a3ddd136aafe1d7dcab4d6b132cda34e20c167d7492dffe53ce5fab0834d3f22c0414f149a7a73a5fbddaef09c53502ed558398784eb17a65fd3c8c92c6d2e73a3752be1abdf1f341ca45b2808f0d84ed512c392db4c711683ac0be89" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Seed the database with initial data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd Doctor

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Available Scripts

### Backend (Doctor-Backend/)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

### Frontend (Doctor/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Services
- `GET /services` - Get all medical services
- `GET /services/:id` - Get service by ID

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID

### Appointments
- `POST /appointments` - Create appointment (requires auth)
- `GET /appointments/my` - Get user appointments (requires auth)

## Features Implemented

### Backend
✅ User authentication with JWT  
✅ Doctor profile management  
✅ Service catalog  
✅ Appointment booking system  
✅ Payment processing structure (Stripe integration ready)  
✅ Database models and relationships  
✅ Data seeding for development  

### Frontend
✅ Responsive design with HealthHive branding  
✅ Homepage with hero section  
✅ How It Works section  
✅ Key Services showcase  
✅ Testimonials  
✅ Mobile-friendly navigation  
✅ Authentication pages (login/signup)  
✅ Booking page structure  

## Next Steps for Development

1. **Frontend-Backend Integration**: Connect frontend forms to backend APIs
2. **Payment Integration**: Complete Stripe payment processing
3. **Real-time Features**: Add video consultation capabilities
4. **Dashboard**: Create doctor and patient dashboards
5. **Notifications**: Implement email/SMS notifications
6. **Testing**: Add comprehensive test coverage

## Environment Variables

Make sure to create a `.env` file in the `Doctor-Backend` directory with:

```env
MONGO_URI=mongodb+srv://sspegah:kdgShXHvlSY47T0y@cluster0.s9pmg.mongodb.net/HealthHive?retryWrites=true&w=majority
JWT_SECRET=97f25b9fd264231f373cfdbb5592406c1ebe14938105ea35163d6213a815f578d9cb7b92e9964accb354ad28cfd0fcb099dc77894fac6ab0b7a7fbb2af6a12184cfa6caf5189bcec1ceacd2fd9164baf178e26eeee76ddc775cbe07d51875c7b6e9d2f725cc6907a16b9b99dd2db3a396b30f07166752d859827f35e3af46ed43ff8eb4a89e8e68318c04b5682601359031f0480dc04eab06fe7c5806d17d636f295c43a3ddd136aafe1d7dcab4d6b132cda34e20c167d7492dffe53ce5fab0834d3f22c0414f149a7a73a5fbddaef09c53502ed558398784eb17a65fd3c8c92c6d2e73a3752be1abdf1f341ca45b2808f0d84ed512c392db4c711683ac0be89
PORT=5000
NODE_ENV=development
```

## Support

If you encounter any issues during setup, check:
1. Node.js version compatibility
2. MongoDB connection status
3. Environment variables are set correctly
4. All dependencies are installed

Happy coding! 🚀 
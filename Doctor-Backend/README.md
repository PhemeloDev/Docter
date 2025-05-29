# HealthHive Backend API

Backend API for the HealthHive Doctor application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Doctor profile management
- Appointment booking and management
- Service catalog
- Payment processing with Stripe
- Real-time notifications
- RESTful API design

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Stripe account (for payments)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://sspegah:kdgShXHvlSY47T0y@cluster0.s9pmg.mongodb.net/HealthHive?retryWrites=true&w=majority
JWT_SECRET=97f25b9fd264231f373cfdbb5592406c1ebe14938105ea35163d6213a815f578d9cb7b92e9964accb354ad28cfd0fcb099dc77894fac6ab0b7a7fbb2af6a12184cfa6caf5189bcec1ceacd2fd9164baf178e26eeee76ddc775cbe07d51875c7b6e9d2f725cc6907a16b9b99dd2db3a396b30f07166752d859827f35e3af46ed43ff8eb4a89e8e68318c04b5682601359031f0480dc04eab06fe7c5806d17d636f295c43a3ddd136aafe1d7dcab4d6b132cda34e20c167d7492dffe53ce5fab0834d3f22c0414f149a7a73a5fbddaef09c53502ed558398784eb17a65fd3c8c92c6d2e73a3752be1abdf1f341ca45b2808f0d84ed512c392db4c711683ac0be89
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Doctors
- `GET /api/doctors` - Get all doctors (with filtering)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:id/availability` - Get doctor availability
- `POST /api/doctors/profile` - Create doctor profile
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/meta/specialties` - Get all specialties

### Appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/my` - Get user's appointments
- `GET /api/appointments/doctor` - Get doctor's appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PATCH /api/appointments/:id/status` - Update appointment status
- `PATCH /api/appointments/:id/prescription` - Add prescription
- `PATCH /api/appointments/:id/rating` - Add rating/review

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `GET /api/services/meta/categories` - Get service categories

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund` - Process refund
- `POST /api/payments/webhook` - Stripe webhook

## Database Schema

### User
- Personal information
- Authentication credentials
- Role-based access (patient, doctor, admin)

### Doctor
- Professional information
- Specialties and qualifications
- Availability schedule
- Rating system

### Appointment
- Booking details
- Payment information
- Prescription data
- Rating/review system

### Service
- Medical service catalog
- Pricing and duration
- Category organization

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing 
# HealthHive Backend API v2.0

<div align="center">
  <h1>🏥 HealthHive - Advanced Telemedicine Platform</h1>
  <p>A comprehensive, production-ready backend API for telemedicine and healthcare management</p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://mongodb.com/)
  [![Express](https://img.shields.io/badge/Express-v4+-blue.svg)](https://expressjs.com/)
  [![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
</div>

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Patient, Doctor, Admin)
- **Rate limiting** for login attempts (5 attempts per 15 minutes)
- **Password encryption** using bcryptjs

### 👨‍⚕️ Doctor Management
- **Complete doctor profiles** with specialties, experience, and qualifications
- **Availability scheduling** and calendar management
- **Rating and review system** with detailed analytics
- **Doctor search and filtering** by specialty, rating, and location

### 📅 Appointment System
- **Smart booking system** with conflict detection
- **Multiple consultation types** (Video, Chat, Phone)
- **Automated status updates** (scheduled → confirmed → completed → rated)
- **Prescription management** with medication tracking
- **No-show detection** and automatic status updates

### 💳 Payment Processing
- **Stripe integration** for secure payment processing
- **Payment intent creation** and confirmation
- **Refund processing** with reason tracking
- **Payment history** and transaction management
- **Webhook support** for real-time payment updates

### 📧 Communication & Notifications
- **Email notifications** with professional templates
- **Real-time notification system** with priority levels
- **Automated appointment reminders** (24 hours before)
- **Review request automation** (2 days after completion)
- **Multi-channel notifications** (Email, Push, SMS ready)

### 📊 Analytics & Reporting
- **Doctor dashboard analytics** with revenue tracking
- **Patient dashboard** with spending and service analytics
- **Platform-wide analytics** for admin users
- **Monthly trend analysis** and growth metrics
- **Performance indicators** and completion rates

### ⚡ Advanced Features
- **Automated job scheduling** with node-cron
- **File upload support** with image processing
- **API rate limiting** (100 requests per 15 minutes)
- **Request compression** and performance optimization
- **Security headers** with Helmet.js
- **Graceful shutdown** handling
- **Health monitoring** endpoints

## 🛠️ Tech Stack

- **Runtime:** Node.js v16+
- **Framework:** Express.js v4+
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe API
- **Email:** Nodemailer with SMTP
- **Scheduling:** Node-cron
- **Security:** Helmet, Rate Limiting, CORS
- **Validation:** Joi, Express-validator
- **Testing:** Jest, Supertest
- **Development:** Nodemon, ESLint

## 📋 Prerequisites

- **Node.js** v16.0.0 or higher
- **MongoDB Atlas** account (or local MongoDB v6+)
- **Stripe** account for payment processing
- **SMTP Email** service (Gmail, SendGrid, etc.)

## 🔧 Installation & Setup

### 1. Clone and Navigate
```bash
git clone https://github.com/PhemeloDev/Docter.git HealthHive
cd HealthHive/Doctor-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://sspegah:kdgShXHvlSY47T0y@cluster0.s9pmg.mongodb.net/HealthHive?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=97f25b9fd264231f373cfdbb5592406c1ebe14938105ea35163d6213a815f578d9cb7b92e9964accb354ad28cfd0fcb099dc77894fac6ab0b7a7fbb2af6a12184cfa6caf5189bcec1ceacd2fd9164baf178e26eeee76ddc775cbe07d51875c7b6e9d2f725cc6907a16b9b99dd2db3a396b30f07166752d859827f35e3af46ed43ff8eb4a89e8e68318c04b5682601359031f0480dc04eab06fe7c5806d17d636f295c43a3ddd136aafe1d7dcab4d6b132cda34e20c167d7492dffe53ce5fab0834d3f22c0414f149a7a73a5fbddaef09c53502ed558398784eb17a65fd3c8c92c6d2e73a3752be1abdf1f341ca45b2808f0d84ed512c392db4c711683ac0be89

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Database Seeding
```bash
# Seed the database with initial service data
npm run seed
```

### 5. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | User registration | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| PUT | `/auth/profile` | Update user profile | ✅ |

### Doctor Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/doctors` | List all doctors | ❌ |
| GET | `/doctors/:id` | Get doctor details | ❌ |
| GET | `/doctors/:id/availability` | Get doctor availability | ❌ |
| POST | `/doctors/profile` | Create doctor profile | ✅ |
| PUT | `/doctors/profile` | Update doctor profile | ✅ |
| GET | `/doctors/meta/specialties` | Get all specialties | ❌ |

### Appointment Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/appointments` | Create appointment | ✅ |
| GET | `/appointments/my` | Get user appointments | ✅ |
| GET | `/appointments/doctor` | Get doctor appointments | ✅ |
| GET | `/appointments/:id` | Get appointment details | ✅ |
| PATCH | `/appointments/:id/status` | Update appointment status | ✅ |
| PATCH | `/appointments/:id/prescription` | Add prescription | ✅ |
| PATCH | `/appointments/:id/rating` | Add rating/review | ✅ |

### Service Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | Get all services | ❌ |
| GET | `/services/:id` | Get service details | ❌ |
| POST | `/services` | Create new service | ✅ |
| PUT | `/services/:id` | Update service | ✅ |
| GET | `/services/meta/categories` | Get service categories | ❌ |

### Payment Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create-payment-intent` | Create payment intent | ✅ |
| POST | `/payments/confirm-payment` | Confirm payment | ✅ |
| GET | `/payments/history` | Get payment history | ✅ |
| POST | `/payments/refund` | Process refund | ✅ |
| POST | `/payments/webhook` | Stripe webhook handler | ❌ |

### Notification Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | ✅ |
| PATCH | `/notifications/:id/read` | Mark notification as read | ✅ |
| PATCH | `/notifications/read-all` | Mark all as read | ✅ |
| DELETE | `/notifications/:id` | Delete notification | ✅ |
| GET | `/notifications/stats` | Get notification statistics | ✅ |

### Analytics Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/doctor/dashboard` | Doctor dashboard analytics | ✅ |
| GET | `/analytics/patient/dashboard` | Patient dashboard analytics | ✅ |
| GET | `/analytics/platform` | Platform-wide analytics | ✅ |

## 🔒 Security Features

### Rate Limiting
- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 login attempts per 15 minutes per IP
- **Speed Limiting:** Delays added after 50 requests per 15 minutes

### Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- JWT token expiration

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://your-production-connection
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
FRONTEND_URL=https://your-production-domain.com
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  },
  "environment": "development",
  "database": "connected"
}
```

### API Documentation Endpoint
```
GET /api
```

## 🔄 Automated Jobs

The system includes several automated background jobs:

- **Appointment Reminders:** Every hour, sends reminders for next-day appointments
- **Review Requests:** Daily at 10 AM, requests reviews for completed appointments
- **Status Updates:** Every 30 minutes, marks missed appointments as no-show
- **Notification Cleanup:** Weekly cleanup of old read notifications
- **Analytics Aggregation:** Daily data aggregation for reporting

## 📈 Performance Optimizations

- **Compression:** Gzip compression for all responses
- **Database Indexing:** Optimized indexes for frequent queries
- **Connection Pooling:** MongoDB connection optimization
- **Caching:** Response caching for static data
- **Request Logging:** Comprehensive request logging

## 🛠️ Development Tools

### Available Scripts
```bash
npm run dev           # Start development server with nodemon
npm start            # Start production server
npm test             # Run test suite
npm run seed         # Seed database with sample data
npm run seed:dev     # Seed for development environment
npm run lint         # Run ESLint
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
```

## 📦 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  dateOfBirth: Date,
  role: ['patient', 'doctor', 'admin'],
  profilePicture: String,
  isVerified: Boolean,
  insurance: {
    provider: String,
    policyNumber: String
  }
}
```

### Doctor Model
```javascript
{
  user: ObjectId (ref: User),
  specialty: String,
  yearsOfExperience: Number,
  qualifications: Array,
  languages: Array,
  bio: String,
  consultationFee: Number,
  rating: {
    average: Number,
    count: Number
  },
  availability: Array,
  isActive: Boolean,
  licenseNumber: String,
  services: [ObjectId] (ref: Service)
}
```

### Appointment Model
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  service: ObjectId (ref: Service),
  appointmentDate: Date,
  appointmentTime: String,
  duration: Number,
  status: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
  type: ['video', 'chat', 'phone'],
  reasonForVisit: String,
  symptoms: String,
  payment: {
    amount: Number,
    status: ['pending', 'completed', 'failed', 'refunded'],
    paymentIntentId: String,
    transactionId: String
  },
  prescription: {
    medications: Array,
    notes: String
  },
  rating: {
    score: Number,
    review: String,
    date: Date
  },
  reminderSent: Boolean
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email:** support@healthhive.com
- **Documentation:** [API Docs](http://localhost:5000/api)
- **Health Check:** [Status](http://localhost:5000/health)

---

<div align="center">
  <p>Built with ❤️ by the HealthHive Team</p>
  <p>Making healthcare accessible to everyone, everywhere.</p>
</div> 
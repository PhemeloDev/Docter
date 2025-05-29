# HealthHive - Complete Telemedicine Platform

<div align="center">
  <h1>🏥 HealthHive - Advanced Telemedicine Platform</h1>
  <p>A comprehensive, production-ready full-stack telemedicine platform connecting patients with healthcare providers</p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-v14+-blue.svg)](https://nextjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)](https://mongodb.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-v5+-blue.svg)](https://typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
</div>

## 🌟 Overview

HealthHive is a modern, comprehensive telemedicine platform that enables remote healthcare consultations between patients and licensed medical professionals. Built with cutting-edge technologies and industry best practices, it provides a secure, scalable, and user-friendly solution for digital healthcare.

## 🚀 Key Features

### 🔐 **Authentication & Security**
- JWT-based authentication with role-based access control
- Rate limiting and DDoS protection
- HIPAA-compliant data handling
- Secure payment processing with Stripe
- End-to-end encryption for sensitive data

### 👨‍⚕️ **Doctor Management**
- Comprehensive doctor profiles with qualifications
- Specialty-based categorization and search
- Availability scheduling and calendar management
- Performance analytics and rating system
- Revenue tracking and reporting

### 🏥 **Patient Experience**
- Intuitive appointment booking system
- Multiple consultation types (Video, Chat, Phone)
- Prescription management and refill requests
- Medical history and document storage
- Insurance integration and claims processing

### 💊 **Medical Services**
- General consultations and primary care
- Mental health services and therapy
- Pediatric care and family medicine
- Dermatology and specialist consultations
- Prescription refills and medication management
- Urgent care for non-emergency conditions

### 📊 **Analytics & Reporting**
- Real-time dashboard analytics
- Revenue and performance metrics
- Patient satisfaction tracking
- Appointment trends and insights
- Platform-wide statistics for administrators

### 🔔 **Communication**
- Automated email notifications
- Real-time in-app notifications
- Appointment reminders and confirmations
- Review requests and feedback collection
- Multi-channel communication support

## 🛠️ Technology Stack

### Frontend (Doctor/)
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Custom React components
- **State Management:** React Hooks and Context API
- **Authentication:** JWT with secure storage

### Backend (Doctor-Backend/)
- **Runtime:** Node.js v16+
- **Framework:** Express.js with TypeScript support
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcrypt password hashing
- **Payments:** Stripe integration
- **Email:** Nodemailer with SMTP
- **Scheduling:** Node-cron for automated jobs
- **Security:** Helmet, CORS, Rate limiting
- **Testing:** Jest and Supertest

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB instance)
- **Stripe** account for payment processing
- **SMTP Email** service (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/PhemeloDev/Docter.git HealthHive
cd HealthHive
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd Doctor-Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Backend Configuration below)

# Seed the database
npm run seed

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd Doctor

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## ⚙️ Configuration

### Backend Environment Variables (.env)

Create a `.env` file in the `Doctor-Backend/` directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://sspegah:kdgShXHvlSY47T0y@cluster0.s9pmg.mongodb.net/HealthHive?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=97f25b9fd264231f373cfdbb5592406c1ebe14938105ea35163d6213a815f578d9cb7b92e9964accb354ad28cfd0fcb099dc77894fac6ab0b7a7fbb2af6a12184cfa6caf5189bcec1ceacd2fd9164baf178e26eeee76ddc775cbe07d51875c7b6e9d2f725cc6907a16b9b99dd2db3a396b30f07166752d859827f35e3af46ed43ff8eb4a89e8e68318c04b5682601359031f0480dc04eab06fe7c5806d17d636f295c43a3ddd136aafe1d7dcab4d6b132cda34e20c167d7492dffe53ce5fab0834d3f22c0414f149a7a73a5fbddaef09c53502ed558398784eb17a65fd3c8c92c6d2e73a3752be1abdf1f341ca45b2808f0d84ed512c392db4c711683ac0be89

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Stripe Configuration (Replace with your keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Environment Variables

Create a `.env.local` file in the `Doctor/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 📚 API Documentation

The API is fully documented and available at:
- **Development:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

### Main Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `POST /api/auth/register` | User registration |
| **Auth** | `POST /api/auth/login` | User login |
| **Doctors** | `GET /api/doctors` | List doctors |
| **Appointments** | `POST /api/appointments` | Book appointment |
| **Services** | `GET /api/services` | Available services |
| **Payments** | `POST /api/payments/create-payment-intent` | Process payment |
| **Notifications** | `GET /api/notifications` | User notifications |
| **Analytics** | `GET /api/analytics/doctor/dashboard` | Doctor analytics |

Full API documentation available in [Doctor-Backend/README.md](Doctor-Backend/README.md)

## 🧪 Testing

### Backend Tests
```bash
cd Doctor-Backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd Doctor
npm test
npm run test:watch
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set secure JWT secret
   - Configure production Stripe keys

2. **Database:**
   - Ensure MongoDB Atlas is configured for production
   - Set appropriate security rules and IP whitelist

3. **Email Service:**
   - Configure production SMTP settings
   - Consider using SendGrid or similar service

### Frontend Deployment (Vercel/Netlify)

1. **Build Configuration:**
   ```bash
   npm run build
   npm start
   ```

2. **Environment Variables:**
   - Set `NEXT_PUBLIC_API_URL` to production backend URL
   - Configure production Stripe publishable key

### Docker Deployment

Both services include Docker support:

```bash
# Backend
cd Doctor-Backend
npm run docker:build
npm run docker:run

# Frontend
cd Doctor
docker build -t healthhive-frontend .
docker run -p 3000:3000 healthhive-frontend
```

## 📊 Monitoring & Analytics

### Health Monitoring
- **Backend Health:** `GET /health`
- **Database Status:** MongoDB connection monitoring
- **Performance Metrics:** Response times and throughput
- **Error Tracking:** Comprehensive error logging

### User Analytics
- Patient appointment patterns
- Doctor performance metrics
- Service utilization statistics
- Revenue and payment analytics
- User engagement and satisfaction scores

## 🔒 Security & Compliance

### Security Measures
- **Data Encryption:** All sensitive data encrypted at rest and in transit
- **Authentication:** Multi-factor authentication support
- **Authorization:** Role-based access control
- **Rate Limiting:** API abuse prevention
- **Input Validation:** Comprehensive data sanitization

### HIPAA Compliance
- **Data Protection:** Patient data encryption and secure storage
- **Access Controls:** Audit trails and access logging
- **Communication:** Secure messaging and video consultations
- **Data Retention:** Compliant data retention policies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **Backend:** Node.js with Express and MongoDB
- **Frontend:** React with TypeScript and Tailwind CSS
- **Testing:** Jest for unit tests, Cypress for E2E
- **Linting:** ESLint with Prettier
- **Commits:** Conventional commit messages

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

### Getting Help
- **Documentation:** Complete API and setup documentation
- **Issues:** GitHub Issues for bug reports and feature requests
- **Community:** Join our developer community discussions

### Professional Support
- **Email:** support@healthhive.com
- **Business Inquiries:** business@healthhive.com
- **Technical Support:** Available for enterprise customers

## 🗺️ Roadmap

### Upcoming Features
- [ ] **Mobile App:** React Native mobile application
- [ ] **Video Conferencing:** Integrated video consultation platform
- [ ] **AI Integration:** Symptom checker and diagnosis assistance
- [ ] **Wearables:** Integration with health monitoring devices
- [ ] **Telemedicine Kits:** Home diagnostic equipment support
- [ ] **Multi-language:** Internationalization and localization
- [ ] **Advanced Analytics:** Predictive health analytics
- [ ] **Insurance Integration:** Direct insurance billing and claims

### Performance Improvements
- [ ] **Caching:** Redis implementation for improved performance
- [ ] **CDN:** Content delivery network for global accessibility
- [ ] **Microservices:** Service decomposition for scalability
- [ ] **Real-time:** WebSocket implementation for live features

---

<div align="center">
  <h3>🏥 HealthHive - Making Healthcare Accessible</h3>
  <p>Built with ❤️ by the HealthHive Development Team</p>
  <p>Empowering patients and providers through innovative telemedicine technology</p>
  
  **[Live Demo](https://healthhive-demo.vercel.app)** | **[API Docs](http://localhost:5000/api)** | **[Support](mailto:support@healthhive.com)**
</div> 
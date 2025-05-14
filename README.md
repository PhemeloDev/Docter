# Doctor Consultation App

A proof-of-concept for an online doctor consultation application built with Next.js and Tailwind CSS.

## Features

- **Homepage**: Complete with header, hero section, how it works, services, and testimonials
- **Doctor Profiles**: Browse and view doctor information
- **Booking System**: Multi-step booking process
- **Responsive Design**: Works on mobile, tablet, and desktop

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/` - Main application directory
  - `components/` - Reusable UI components
  - `page.tsx` - Homepage
  - `doctors/` - Doctor listing page
  - `book/` - Appointment booking pages

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety

## Next Steps

This proof-of-concept demonstrates the basic UI and functionality. Further development would include:

1. Authentication system for user accounts
2. Backend integration for real appointment booking
3. Doctor availability calendar
4. Notification system
5. Payment processing integration
6. Video call implementation

## License

MIT

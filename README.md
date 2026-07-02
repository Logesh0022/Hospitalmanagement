# Hospital Management System Backend

Backend API for the React Hospital Management System.

## Features

- Auth with JWT
- Admin, Doctor, Patient roles
- Doctor CRUD
- Patient CRUD
- Appointment booking and status updates
- Prescription create/view
- Notifications
- Profile update
- Settings update
- Dashboard counts

## Setup

```bash
cd hospital-backend
npm install
cp .env.example .env
npm run dev
```

MongoDB must be running locally.

## Seed Demo Data

```bash
npm run seed
```

Demo accounts:

```txt
Admin: admin@hms.com / 123456
Doctor: doctor@hms.com / 123456
Patient: patient@hms.com / 123456
```

## Main API Routes

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/dashboard

GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id

GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id

GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id

GET    /api/prescriptions
POST   /api/prescriptions
PUT    /api/prescriptions/:id
DELETE /api/prescriptions/:id

GET    /api/notifications
POST   /api/notifications
PUT    /api/notifications/read-all
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id

GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/settings
PUT    /api/users/change-password
```

## Authorization Header

For protected routes:

```txt
Authorization: Bearer YOUR_TOKEN
```

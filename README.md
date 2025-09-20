# TheraFlow
**Therapy Scheduling and Attendance Software**

A modern web application for managing therapy sessions, patient schedules, and attendance tracking.

![TheraFlow Dashboard](https://github.com/user-attachments/assets/1eab9292-8c0b-43fe-a20a-257fd723a82d)

## Features

- **Dashboard**: Overview of therapists, patients, sessions, and daily/weekly schedules
- **Session Management**: Schedule and manage therapy sessions
- **Therapist Management**: View and manage therapist profiles
- **Patient Management**: Track patient information and history
- **Attendance Tracking**: Record and monitor session attendance
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **RESTful API** design
- **In-memory storage** (easily upgradeable to database)
- **CORS** and security middleware
- **UUID** for unique identifiers

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Responsive CSS** design
- **Modern component architecture**

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TheraFlow
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3001
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   # Application opens at http://localhost:3000
   ```

### Development Mode

For development with auto-reload:
```bash
# Backend with nodemon
cd backend
npm run dev

# Frontend with React hot reload
cd frontend
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get specific therapist
- `POST /api/therapists` - Create new therapist

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get specific patient
- `POST /api/patients` - Create new patient

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get specific session
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Record attendance

## Sample Data

The application comes with sample data:

**Therapists:**
- Dr. Sarah Johnson (Physical Therapy)
- Dr. Michael Chen (Occupational Therapy)

**Patients:**
- John Smith
- Emily Davis

## Application Structure

```
TheraFlow/
├── backend/
│   ├── index.js          # Express server and API routes
│   ├── package.json      # Backend dependencies
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main application component
│   ├── package.json      # Frontend dependencies
│   └── build/           # Production build
└── README.md
```

## Development Features

- **TypeScript** for type safety
- **Component-based architecture**
- **Responsive design** for all screen sizes
- **Real-time data updates**
- **Form validation**
- **Error handling**

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication and authorization
- Email notifications for appointments
- Calendar integration
- Reporting and analytics
- Mobile app (React Native)
- Payment processing integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

# E-Learning Platform

A comprehensive e-learning management system built with React and Node.js, featuring role-based access control for Students, Teachers, Staff, and Principals.

## Features

### 🎓 Student Features
- View personal dashboard
- Access enrolled courses
- Submit assignments
- View report cards and grades
- Check assignment status
- View announcements

### 👨‍🏫 Teacher Features
- Create and manage courses
- Create assignments and exams
- Record student grades
- Track attendance
- Manage lesson schedules
- Upload course materials

### 👥 Staff Features
- Add and manage teachers
- Create announcements
- Administer courses
- Record student grades
- Manage user accounts
- Monitor system activities

### 🏫 Principal Features
- Monitor all teacher activities
- Oversee staff performance
- View comprehensive reports
- Manage all users
- Access all system features
- Generate analytics

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-learning-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, client)
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default User Roles

### Student
- Can view their courses, assignments, and grades
- Can submit assignments
- Can view announcements targeted to them

### Teacher
- Can create and manage courses
- Can create assignments and record grades
- Can track attendance
- Can manage their own profile

### Staff
- Can add teachers and students
- Can create announcements
- Can manage courses and grades
- Can perform administrative tasks

### Principal
- Full access to all features
- Can monitor all activities
- Can manage all users
- Can view comprehensive reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Staff/Principal only)
- `POST /api/users` - Create user (Staff/Principal only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Staff/Principal only)

### Courses
- `GET /api/courses` - Get courses
- `POST /api/courses` - Create course (Teacher/Staff/Principal)
- `PUT /api/courses/:id` - Update course
- `POST /api/courses/:id/enroll` - Enroll students

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (Staff/Principal)
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Grades
- `GET /api/grades` - Get grades
- `POST /api/grades` - Record grade (Teacher/Staff/Principal)
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (Teacher/Staff/Principal)
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `PUT /api/assignments/:id/grade` - Grade assignment

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance (Teacher/Staff/Principal)
- `PUT /api/attendance/:id` - Update attendance record

### Schedules
- `GET /api/schedules` - Get schedules
- `PUT /api/schedules/:id` - Update schedule

## Database Schema

### User Model
- Personal information (name, email, password)
- Role-based fields (studentId, department, grade)
- Authentication and status fields

### Course Model
- Course details (title, description, subject, grade)
- Teacher and student relationships
- Schedule and materials
- Assignment references

### Assignment Model
- Assignment details (title, description, due date)
- Course and teacher relationships
- Student submissions and grades
- Materials and attachments

### Grade Model
- Student, course, and assignment relationships
- Grade value and type
- Semester and academic year tracking
- Pass/fail status

### Announcement Model
- Content and targeting
- Priority levels
- Author and audience information
- Expiration dates

### Attendance Model
- Student, course, and teacher relationships
- Date and status tracking
- Notes and semester information

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Protected routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

# 🎓 LearnHub - Modern Learning Management System

A comprehensive, full-stack learning management system built with React and Node.js, designed to provide an intuitive platform for course creation, management, and learning. Features a modern, responsive design with enhanced user experience and accessibility.

![LearnHub](https://img.shields.io/badge/LearnHub-LMS-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20Compliant-green?style=for-the-badge)

## ✨ Features

### 🎯 For Students
- **Course Discovery**: Browse and search through available courses with advanced filtering
- **Course Enrollment**: Enroll in courses with secure payment processing
- **Interactive Learning**: Watch video content with progress tracking and section completion
- **Personal Dashboard**: Clean, intuitive dashboard with enrolled courses overview
- **My Courses Section**: Dedicated section for enrolled courses with streamlined navigation
- **Course Progress**: Track learning progress with visual indicators
- **Certificate Generation**: Download course completion certificates (coming soon)

### 👨‍🏫 For Teachers
- **Course Creation**: Upload video content and course materials with thumbnail support
- **Content Management**: Organize and structure course content into sections
- **Student Analytics Dashboard**: Comprehensive analytics for monitoring student progress
  - **Individual Student Tracking**: Monitor each student's progress and engagement
  - **Course Performance Metrics**: View completion rates, active students, and trends
  - **Section-wise Analytics**: Identify which course sections students struggle with
  - **Student Activity Insights**: Track last activity, enrollment dates, and completion status
  - **Progress Visualization**: Visual charts and progress bars for easy understanding
  - **Filtering & Search**: Search students and filter by completion status
- **Course Management**: Edit and update course content and details

### 🔧 For Administrators
- **User Management**: Manage students, teachers, and admin accounts
- **Course Moderation**: Review and approve course submissions
- **System Analytics**: Comprehensive platform analytics and insights
- **Announcement System**: Broadcast important updates to users
- **Maintenance Mode**: Temporarily disable user registrations
- **All Courses Management**: View and manage all courses in the system

## 🎨 Enhanced User Experience

### Modern Design System
- **Material-UI Components**: Professional, consistent design throughout
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Color Scheme**: Modern blue gradient theme with proper contrast ratios
- **Typography**: Clean, readable fonts (Inter, Poppins, Playfair Display)

### Navigation & Accessibility
- **Smart Navigation**: Context-aware navigation that adapts to user role and current section
- **Accessibility Features**: WCAG compliant with proper ARIA labels and focus management
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper semantic HTML and descriptive labels
- **Focus Management**: Clear focus indicators and logical tab order

### Dashboard Enhancements
- **Role-based Dashboards**: Different interfaces for students, teachers, and admins
- **Course Cards**: Beautiful, animated course cards with hover effects
- **Progress Visualization**: Visual progress indicators and completion status
- **Quick Actions**: Streamlined access to common tasks and features

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material-UI (MUI) v5** - Professional component library with theming
- **React Router v6** - Client-side routing with URL parameter support
- **Axios** - HTTP client for API communication with interceptors
- **React Player** - Video player component for course content
- **CSS-in-JS** - Styled components and custom styling

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework with middleware support
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling with schema validation
- **JWT** - JSON Web Tokens for secure authentication
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling for videos and images
- **CORS** - Cross-origin resource sharing configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learnhub.git
   cd learnhub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Development Servers**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
learnhub/
├── backend/
│   ├── config/
│   │   └── connect.js              # Database connection
│   ├── controllers/
│   │   ├── adminController.js      # Admin operations
│   │   └── userControllers.js      # User operations
│   ├── middlewares/
│   │   ├── authMiddleware.js       # Authentication
│   │   ├── adminAuthMiddleware.js  # Admin authentication
│   │   ├── maintenanceMiddleware.js # Maintenance mode
│   │   └── registrationMiddleware.js # Registration validation
│   ├── routers/
│   │   ├── adminRoutes.js          # Admin API routes
│   │   └── userRoutes.js           # User API routes
│   ├── schemas/
│   │   ├── userModel.js            # User schema
│   │   ├── courseModel.js          # Course schema
│   │   ├── adminModel.js           # Admin schema
│   │   ├── announcementModel.js    # Announcement schema
│   │   ├── coursePaymentModel.js   # Payment schema
│   │   ├── enrolledCourseModel.js  # Enrollment schema
│   │   └── settingsModel.js        # Settings schema
│   ├── uploads/                    # File storage (videos, thumbnails)
│   └── index.js                    # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/              # Admin components
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Announcements.jsx
│   │   │   │   ├── CourseList.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── UserList.jsx
│   │   │   ├── common/             # Shared components
│   │   │   │   ├── AllCourses.jsx
│   │   │   │   ├── Announcements.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── NavBar.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── UserHome.jsx
│   │   │   └── user/               # User components
│   │   │       ├── student/
│   │   │       │   ├── CourseContent.jsx
│   │   │       │   ├── EnrolledCourses.jsx
│   │   │       │   └── StudentHome.jsx
│   │   │       └── teacher/
│   │   │           ├── AddCourse.jsx
│   │   │           ├── CourseAnalytics.jsx
│   │   │           └── TeacherHome.jsx
│   │   ├── assets/                 # Static assets
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # Global styles
│   │   └── main.jsx                # App entry point
│   └── public/                     # Public assets
└── README.md
```

## 🔐 Authentication & Authorization

The application implements a comprehensive role-based access control system:

- **Students**: Can enroll in courses, watch content, track progress, and access enrolled courses
- **Teachers**: Can create and manage courses, view detailed student analytics, and track course performance
- **Administrators**: Full system access including user management, course moderation, and platform analytics

### Security Features
- JWT-based authentication with secure token storage
- Password hashing with bcryptjs
- Role-based route protection
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## 📱 Key Features in Detail

### Course Management
- **Video Content**: Upload and stream video content with progress tracking
- **Course Organization**: Structured content with sections and modules
- **Thumbnail Support**: Custom thumbnails for course previews
- **Categorization**: Advanced course categorization and search functionality
- **Progress Tracking**: Real-time progress updates and completion tracking
- **Payment Integration**: Secure course enrollment with payment processing

### User Experience
- **Responsive Design**: Optimized for all device sizes and screen resolutions
- **Modern UI**: Material-UI components with custom theming
- **Intuitive Navigation**: Context-aware navigation that adapts to user actions
- **Real-time Updates**: Live progress updates and status changes
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Analytics & Insights
- **Student Analytics**: Comprehensive tracking of student progress and engagement
- **Course Performance**: Detailed metrics on course completion and student activity
- **Visual Dashboards**: Interactive charts and progress visualizations
- **Filtering & Search**: Advanced filtering options for analytics data

### Admin Features
- **Comprehensive Dashboard**: Analytics overview with key metrics
- **User Management**: Complete user lifecycle management
- **Course Moderation**: Review and approval system for course submissions
- **System Controls**: Maintenance mode and announcement broadcasting
- **Platform Analytics**: System-wide performance and usage metrics

## 🎯 Recent Improvements

### Enhanced Navigation
- **Smart Navigation Bar**: Context-aware navigation that shows relevant buttons
- **Clean My Courses Interface**: Streamlined view when accessing enrolled courses
- **Seamless Switching**: Easy navigation between Dashboard and My Courses sections

### Improved Accessibility
- **ARIA Labels**: Proper accessibility labels for all interactive elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Semantic HTML and descriptive labels
- **Keyboard Navigation**: Full keyboard accessibility

### Visual Enhancements
- **Modern Course Cards**: Beautiful, animated cards with hover effects
- **Progress Visualization**: Visual progress indicators and completion status
- **Consistent Theming**: Unified color scheme and typography throughout
- **Smooth Animations**: Micro-interactions and transitions for better UX

### Performance Optimizations
- **Efficient Routing**: Optimized React Router implementation
- **Component Optimization**: Memoized components and efficient re-renders
- **API Optimization**: Streamlined API calls and data management

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Configure MongoDB connection (Atlas recommended for production)
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure proper CORS configuration for production domains

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Configure environment variables for API endpoints

### Environment Variables
```env
# Backend
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

# Frontend (if needed)
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Ensure accessibility compliance for new features
- Test thoroughly on different devices and browsers
- Update documentation for any new features

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

##Video Demo

[LEARNHUB_VIDEO DEMO](https://drive.google.com/file/d/1DNDQisInw_P09CESzwnfG1A5nu4wb8KI/view?usp=sharing)

## 👨‍💻 Developer

**Shaik Mohammed Yasin** - Full Stack Developer

- **LinkedIn**: [Shaik Mohammed Yasin](https://www.linkedin.com/in/shaik-mohammed-yasin-a45743328/)
- **GitHub**: [imohammedyasin](https://github.com/imohammedyasin)

---

**LearnHub** - Empowering learners worldwide with premium educational content. Join our community and unlock your potential with expert-led courses. 

# Digital Employability Platform for Rural Youth

A comprehensive full-stack web application designed to help rural youth access career opportunities, job information, government schemes, and skill development resources.

## Features

### Core Features
- **User Authentication** - Register, login, and logout with JWT-based authentication
- **Digital Profile System** - Create and manage professional profiles with skills, education, and career interests
- **Job Opportunities** - Browse and filter local job opportunities with personalized recommendations
- **Government Schemes** - Explore government programs and schemes with eligibility criteria
- **Career Resources** - Access interview tips, resume guides, and skill development content
- **Notification System** - Receive notifications for new jobs, schemes, and training programs
- **Admin Panel** - Manage jobs, schemes, and resources (admin only)
- **Chatbot** - Basic rule-based career guidance chatbot

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- CORS enabled

## Project Structure

```
├── backend/                 # Backend Node.js application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth and validation middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env.example        # Environment variables example
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
│
├── app/                    # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env                # Frontend environment variables
│   ├── package.json        # Frontend dependencies
│   └── index.html          # HTML template
│
└── README.md               # This file
```

## Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud database)
3. **npm** or **yarn** (comes with Node.js)

## How to Run the Project

### Step 1: Clone or Download the Project

Extract the project files to a folder on your computer.

### Step 2: Set Up the Backend

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend folder:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Or create manually and add these variables:
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digital-employability
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

5. **Set up MongoDB:**
   
   **Option A: Local MongoDB**
   - Make sure MongoDB is installed and running on your system
   - The default connection string is: `mongodb://localhost:27017/digital-employability`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string and update `MONGODB_URI` in the `.env` file

6. Start the backend server:
   ```bash
   # Development mode (with auto-restart on file changes)
   npm run dev
   
   # OR Production mode
   npm start
   ```

   You should see: `Server running on port 5000` and `MongoDB Connected`

### Step 3: Set Up the Frontend

1. Open a new terminal/command prompt
2. Navigate to the app folder:
   ```bash
   cd app
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Check the `.env` file in the app folder:
   ```bash
   # Should contain:
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

6. Open your browser and go to: `http://localhost:5173`

### Step 4: Create an Admin User (Optional)

To access the admin panel, you need to manually update a user in the database:

1. Connect to your MongoDB database
2. Find the user you want to make admin
3. Update their role to "admin":
   ```javascript
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## Default Ports

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/skills` - Add skill to profile
- `DELETE /api/auth/skills/:skill` - Remove skill from profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/recommendations` - Get recommended jobs for user
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Schemes
- `GET /api/schemes` - Get all schemes (with filters)
- `GET /api/schemes/latest` - Get latest schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `POST /api/schemes` - Create scheme (Admin only)
- `PUT /api/schemes/:id` - Update scheme (Admin only)
- `DELETE /api/schemes/:id` - Delete scheme (Admin only)

### Resources
- `GET /api/resources` - Get all resources (with filters)
- `GET /api/resources/popular` - Get popular resources
- `GET /api/resources/category/:category` - Get resources by category
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource (Admin only)
- `PUT /api/resources/:id` - Update resource (Admin only)
- `DELETE /api/resources/:id` - Delete resource (Admin only)

## Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/digital-employability |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d |

### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check your `MONGODB_URI` in the `.env` file
   - For MongoDB Atlas, whitelist your IP address

2. **Port Already in Use**
   - Change the `PORT` in backend `.env` file
   - Or kill the process using the port

3. **CORS Error**
   - Make sure backend CORS is properly configured
   - Check that `VITE_API_URL` points to the correct backend URL

4. **Module Not Found Errors**
   - Delete `node_modules` folder and `package-lock.json`
   - Run `npm install` again

## Building for Production

### Backend
No build step required for backend. Just run:
```bash
npm start
```

### Frontend
```bash
cd app
npm run build
```

This will create a `dist` folder with optimized files that can be deployed to any static hosting service.

## Deployment

### Backend Deployment Options
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

### Frontend Deployment Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

This project is designed to be beginner-friendly. Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available under the MIT License.

## Support

For any questions or issues, please contact:
- Email: support@digitalemployability.org
- Phone: +91 1800-123-4567

---

**Made with ❤️ for Rural Youth Empowerment**

# Farmer Marketplace - Backend

This is the backend server for the Farmer Marketplace application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- JWT-based authentication
- Protected routes
- Error handling
- Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmer-marketplace/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farmer-marketplace
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/logout` - Logout user (protected)

## Development

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # Route definitions
├── utils/          # Helper functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## License

MIT

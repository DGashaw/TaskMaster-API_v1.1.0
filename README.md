# 📝 TaskMaster-API v1.1.0 - User Authentication Edition

A production-ready RESTful API built with **Node.js** and **Express**, featuring comprehensive **user authentication** with **JWT (JSON Web Tokens)** and **password hashing** for secure task management. Each user can now create, manage, and access their own isolated task data.

---

## 🆕 What's New in v1.1.0

This version introduces **user-centric task management** with industry-standard security practices:

### New Features
* **User Registration & Login:** Secure account creation with email-based authentication
* **JWT Authentication:** Stateless, scalable token-based authentication
* **Password Hashing:** Industry-standard bcrypt hashing for password security
* **User Isolation:** Each user has access to only their own tasks
* **Session Management:** Secure token refresh and logout mechanisms
* **Role-Based Access Control:** Foundation for future permission-based features

---

## 🔐 Security Architecture

### Authentication Flow

```
User Registration
    ↓
Password Hashed (bcrypt)
    ↓
User Stored in MongoDB
    ↓
User Login
    ↓
Credentials Verified
    ↓
JWT Token Generated
    ↓
Token Returned to Client
    ↓
Client Includes Token in Authorization Header
    ↓
Server Validates Token
    ↓
User Access to Own Tasks
```

### Password Hashing

- **Algorithm:** bcrypt (salted hash with 10 rounds)
- **Storage:** Only hashed passwords are stored in the database
- **Plaintext:** Never transmitted or stored
- **Protection:** Resistant to rainbow table and brute-force attacks

### JWT (JSON Web Tokens)

- **Format:** Three-part token (Header.Payload.Signature)
- **Expiration:** Configurable token lifetime (default: 24 hours)
- **Verification:** Server validates signature and expiration on every request
- **Stateless:** No session storage required on the server
- **Security:** Tokens are cryptographically signed and cannot be modified by clients

**Token Anatomy:**
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id_here",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

---

## 📂 API Reference

### 1. User Registration

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_id_12345",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Email already registered",
  "statusCode": 409
}
```

---

### 2. User Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "user_id_12345",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "statusCode": 401
}
```

---

### 3. Get All Tasks (User's Tasks Only)

```http
GET /api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "task_id_1",
      "title": "Learn JWT",
      "completed": false,
      "userId": "user_id_12345",
      "createdAt": "2026-06-19T10:30:00Z",
      "updatedAt": "2026-06-19T10:30:00Z"
    },
    {
      "id": "task_id_2",
      "title": "Implement authentication",
      "completed": true,
      "userId": "user_id_12345",
      "createdAt": "2026-06-18T14:20:00Z",
      "updatedAt": "2026-06-19T09:15:00Z"
    }
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided or token is invalid",
  "statusCode": 401
}
```

---

### 4. Get a Specific Task

```http
GET /api/v1/tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "task_id_1",
    "title": "Learn JWT",
    "completed": false,
    "userId": "user_id_12345",
    "createdAt": "2026-06-19T10:30:00Z",
    "updatedAt": "2026-06-19T10:30:00Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Unauthorized: You can only access your own tasks",
  "statusCode": 403
}
```

---

### 5. Create a New Task

```http
POST /api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Complete project documentation"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_id_3",
    "title": "Complete project documentation",
    "completed": false,
    "userId": "user_id_12345",
    "createdAt": "2026-06-19T11:45:00Z",
    "updatedAt": "2026-06-19T11:45:00Z"
  }
}
```

---

### 6. Update a Task

```http
PATCH /api/v1/tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "task_id_1",
    "title": "Updated title",
    "completed": true,
    "userId": "user_id_12345",
    "createdAt": "2026-06-19T10:30:00Z",
    "updatedAt": "2026-06-19T12:00:00Z"
  }
}
```

---

### 7. Delete a Task

```http
DELETE /api/v1/tasks/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 🔑 Authentication Headers

All protected endpoints require the following header:

| Header | Format | Example |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> **Note:** The `Authorization` header format is case-sensitive. The prefix must be `Bearer` (with capital B).

---

## ⚠️ HTTP Status Codes

| Code | Meaning | Common Scenario |
| :--- | :--- | :--- |
| `200` | OK | Successful GET, PATCH, DELETE request |
| `201` | Created | Successful POST request (resource created) |
| `400` | Bad Request | Invalid input, missing required fields |
| `401` | Unauthorized | Missing token or token expired |
| `403` | Forbidden | Authenticated but accessing other user's data |
| `404` | Not Found | Task or user doesn't exist |
| `409` | Conflict | Email already registered |
| `500` | Server Error | Internal server error |

---

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
* **Authentication:** [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
* **Password Hashing:** [bcrypt](https://www.npmjs.com/package/bcrypt)
* **Environment:** [Dotenv](https://www.npmjs.com/package/dotenv)
* **Validation:** [Validator.js](https://www.npmjs.com/package/validator)
* **Testing:** [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), [Supertest](https://github.com/visionmedia/supertest)
* **Code Quality:** [ESLint (Standard)](https://standardjs.com/)

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/products/docker-desktop) (for MongoDB)

### 1. Clone the Repository

```bash
git clone git@github.com:DGashaw/TaskMaster-API.git
cd TaskMaster-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmaster

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=24h

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

### 4. Start MongoDB (Using Docker)

```bash
npm run infrastructure-start
```

### 5. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run development
```

**Production Mode:**
```bash
npm start
```

### 6. Run Tests

```bash
npm test
```

**With Coverage:**
```bash
npm run test-coverage
```

---

## 📋 Project Structure

```
TaskMaster-API/
├── config/
│   └── dbConnect.js          # MongoDB connection
├── controller/
│   ├── taskApiController.js  # Task business logic
│   └── authController.js     # Authentication logic (NEW)
├── models/
│   ├── taskSchema.js         # Task model
│   └── userSchema.js         # User model (NEW)
├── routes/
│   ├── taskApiRoutes.js      # Task endpoints
│   └── authRoutes.js         # Auth endpoints (NEW)
├── utility/
│   ├── apiAuthentication.js  # Middleware (UPDATED)
│   └── passwordHash.js       # Password utility (NEW)
├── server/
│   └── server.js             # Express app setup
├── test/
│   ├── app.test.js
│   ├── server.test.js
│   ├── database.test.js
│   └── auth.test.js          # Auth tests (NEW)
├── app.js                    # Express app configuration
├── package.json
├── .env                      # Environment variables
└── docker-compose.yml        # MongoDB container config
```

---

## 🔒 Security Best Practices

### Implemented

✅ **Password Hashing:** All passwords are hashed using bcrypt before storage
✅ **JWT Tokens:** Stateless authentication with cryptographic signatures
✅ **HTTPS Ready:** Can be deployed with SSL/TLS certificates
✅ **CORS Protection:** Configured to prevent unauthorized cross-origin requests
✅ **Input Validation:** All user inputs are validated and sanitized
✅ **Environment Variables:** Sensitive data stored in `.env` (not in code)
✅ **Error Handling:** Generic error messages prevent information leakage

### Recommended for Production

🔐 **Use HTTPS:** Always use HTTPS (TLS/SSL) in production
🔐 **Strong JWT Secret:** Generate a cryptographically secure JWT secret
🔐 **Rate Limiting:** Implement rate limiting on authentication endpoints
🔐 **CORS Whitelist:** Define specific allowed origins instead of `*`
🔐 **Token Refresh:** Implement refresh token mechanism for longer sessions
🔐 **Audit Logging:** Log all authentication attempts for security monitoring
🔐 **2FA (Optional):** Implement two-factor authentication for additional security

---

## 🧪 Testing Authentication

### Using cURL

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Create Task (with token):**
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Express"
  }'
```

### Using Postman

1. **Register Endpoint:**
   - URL: `POST http://localhost:5000/api/v1/auth/register`
   - Body (JSON): `{ "email": "...", "password": "...", "name": "..." }`

2. **Login Endpoint:**
   - URL: `POST http://localhost:5000/api/v1/auth/login`
   - Body (JSON): `{ "email": "...", "password": "..." }`
   - Save the `token` from response

3. **Protected Endpoints:**
   - Headers → Add new → Key: `Authorization`, Value: `Bearer <your_token>`

---

## 📊 Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
    // This is the bcrypt hash, never the plaintext
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Task Schema (Updated)

```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true  // NEW: Links task to user
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 🚀 Deployment

### Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_super_secret_key
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main
```

### Docker Compose (Full Stack)

```bash
docker-compose up -d
```

---

## 📝 Migration Guide from v1.0.0

If you're upgrading from the previous API Key-based authentication:

1. **Breaking Changes:**
   - ❌ `x-api-key` header no longer supported
   - ✅ Use `Authorization: Bearer <token>` instead

2. **Database Migration:**
   - Add `userId` field to existing tasks
   - Migrate tasks to a default user or prompt reassignment

3. **Client Updates:**
   - Replace API key logic with login/register flow
   - Store JWT token in localStorage or session storage
   - Add token to Authorization header for all requests

---

## 🐛 Troubleshooting

### "Invalid token" Error

**Possible Causes:**
- Token expired (requires re-login)
- Token malformed or corrupted
- JWT_SECRET doesn't match between client and server

**Solution:**
```bash
# Verify JWT_SECRET in .env
echo $JWT_SECRET

# Re-login to get a fresh token
```

### "Unauthorized: Email already registered"

**Solution:**
- Use a different email address for registration
- Or login with existing credentials

### "Cannot connect to MongoDB"

**Solution:**
```bash
# Start MongoDB container
npm run infrastructure-start

# Verify container is running
docker ps
```

---

## 📞 Support & Contributing

For issues, feature requests, or contributions, please visit the [GitHub Repository](https://github.com/DGashaw/TaskMaster-API).

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git commit -m "feat: add your feature"

# Push and create pull request
git push origin feature/your-feature-name
```

---

## 📄 License

ISC License - See LICENSE file for details

**Author:** Daniel Gashaw

---

## 🎯 Version History

- **v1.1.0** (Current) - Added user authentication with JWT and password hashing
- **v1.0.0** - Initial release with API Key authentication and basic CRUD operations

---

**Last Updated:** June 19, 2026

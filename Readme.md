# 🚀 Scalable Backend Node.js Setup

This repository provides a scalable Node.js backend setup, designed to simplify the development process for building production-ready APIs. It covers critical aspects like authentication, database integration, error handling, file uploads, and environment variable management.

---

## 📁 Project Structure

```
Scalable-Backend-Nodejs-Setup/
├── public/
│   └── temp/          # Temporary storage for files before uploading to cloud (e.g., Cloudinary)
│       └── .gitkeep   # Keeps empty folders tracked in Git
├── src/
│   ├── controllers/   # Business logic for each route
│   ├── db/            # Database connection logic
│   ├── models/        # Mongoose schemas for MongoDB
│   ├── utils/         # Helper functions and utilities
│   ├── middlewares/   # Custom middleware (e.g., auth verification)
│   ├── routes/        # API endpoints
│   ├── constants.js   # Centralized variable definitions
│   ├── index.js       # Main server entry point
│   └── app.js         # Express app configuration
├── .env               # Environment variables (not committed to Git)
├── .gitignore         # Specifies files to ignore in Git
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation
```

---

## 📋 Steps Taken to Set Up the Backend Project

1. **Initialize Node.js Project:**

   ```bash
   npm init -y
   ```

2. **Create Temporary Folder for File Uploads:**

   * Created the `public/temp/` folder for temporarily storing files before uploading to third-party services like AWS, Azure, or Cloudinary.
   * Added a `.gitkeep` file to ensure Git tracks this empty directory.

3. **Create .gitignore File:**

   * Created a `.gitignore` file in the main project directory to prevent sensitive files (e.g., `.env`) from being committed to the repository.
   * Used a Node.js `.gitignore` template to exclude unnecessary files.

4. **Set Up Environment Variables:**

   * Created a `.env` file to store sensitive information and configuration settings like database URLs, JWT secrets, and API keys.

5. **Basic File Setup:**

   * Created a `src/` directory with the following key files:

     * `index.js` - Entry point for the server.
     * `app.js` - Main Express application configuration.
     * `constants.js` - Centralized variable definitions for cleaner code.

6. **Enable ES Modules:**

   * Added the following line in `package.json` to use ES modules:

   ```json
   "type": "module"
   ```

7. **Install Essential Packages:**

   ```bash
   npm install express mongoose dotenv cookie-parser cors bcrypt jsonwebtoken cloudinary multer mongoose-aggregate-paginate-v2
   npm install -D nodemon
   ```

8. **Configure Nodemon for Development:**

   * Added a development script in `package.json`:

   ```json
   "scripts": {
     "dev": "nodemon src/index.js"
   }
   ```

9. **Database Setup:**

   * Created an account on MongoDB Atlas for cloud database hosting.
   * Wrote database connection logic in the `db/` directory for a cleaner structure.
   * Used async/await with try-catch blocks for robust error handling.

10. **Middleware and Utility Functions:**

* Created a higher-order function `asyncHandler.js` for centralized error handling.
* Added `apiError.js` to extend the native Node.js Error class for custom error messages.

11. **User Authentication:**

* Implemented JWT-based authentication in `User.model.js` using pre hooks and custom methods.
* Created `auth.middleware.js` to verify tokens before accessing protected routes.

12. **File Upload Handling:**

* Configured file uploads using `multer` and `cloudinary.js` for secure media storage.
* Wrote middleware to handle file uploads in `multer.middleware.js`.

13. **Routing and Controllers:**

* Defined endpoints in `routes/` and separated logic into `controllers/` for scalability.
* Created user authentication routes like `register`, `login`, and `logout` in `user.routes.js`.

14. **Environment Configuration:**

* Always use `dotenv.config()` at the top of `index.js` to load environment variables.

15. **Testing and Debugging:**

* Use tools like Postman or Insomnia to test APIs.

---

## 🚀 Running the Application

1. **Start the Server:**

   ```bash
   npm run dev
   ```

2. **Test the Endpoints:**

   * Use Postman or cURL to interact with the API.

---

## 📚 Additional Notes

* **Environment Variables:** Remember to restart `nodemon` if you make changes to `.env`.
* **Folder Structure:** This structure ensures a clean, maintainable, and scalable codebase.

---


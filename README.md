# Taskify

**steps to clone and set up Taskify**

```markdown
## 🛠️ Steps to Clone and Set Up Taskify

Follow these steps to clone the repository and set up the project locally.
```

### 1. Clone the Repository

First, clone the Taskify repository to your local machine:

```bash
git clone https://github.com/rafiq097/taskify.git
cd taskify
```

### 2. Set Up the Backend

Navigate to the `backend` directory and install the required dependencies:

```bash
cd backend
npm install
```

#### 2.1. Configure Environment Variables

Create a `.env` file inside the `backend` directory and add the following environment variables:

```bash
MONGO_URI=mongodb://localhost:27017/taskify   # Your MongoDB connection string (local or Atlas)
JWT_SECRET=your_jwt_secret                    # Secret for JWT authentication
```

Ensure you have MongoDB running locally or connect to a MongoDB Atlas cluster.

### 3. Set Up the Frontend

Navigate to the `frontend` directory and install the required dependencies:

```bash
cd ../frontend
npm install
```

### 4. Build the Frontend

Run the build command in the `frontend` directory to generate production-ready static files:

```bash
npm run build
```

This will create a `dist/` folder in the frontend directory that contains the built assets.

### 5. Start the Application

Go back to the root directory and start the backend server:

```bash
cd ..
npm start
```

The server will run on `http://localhost:5000` by default. The built frontend will be served from the backend's `dist/` folder.

### 6. Access the Application

Open your browser and navigate to `http://localhost:5000` to start using Taskify.

---

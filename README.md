# SkillSync

SkillSync is a full-stack web application designed to help users connect, collaborate, and manage projects. It features a robust Node.js/Express backend and a modern, responsive React frontend.

## 🚀 Features

-   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt.
    
-   **Project Management:** Create and manage projects (inferred from project structure).
    
-   **Media Handling:** Cloud-based image and media uploads via Cloudinary.
    
-   **Social Interactions:** Connect with other users (inferred from `social` components).
    
-   **Email Notifications:** Integrated SMTP support using Nodemailer.
    
-   **Responsive UI:** Built with React and Tailwind CSS for a seamless mobile and desktop experience.
    

## 🛠️ Tech Stack

### Backend

-   **Runtime:** Node.js
    
-   **Framework:** Express.js
    
-   **Database:** MongoDB (via Mongoose)
    
-   **Authentication:** JSON Web Token (JWT), Bcrypt
    
-   **File Storage:** Cloudinary (with Multer)
    
-   **Email:** Nodemailer
    

### Frontend

-   **Framework:** React (v19)
    
-   **Build Tool:** Vite
    
-   **Styling:** Tailwind CSS
    
-   **Routing:** React Router DOM
    
-   **HTTP Client:** Axios
    
-   **Notifications:** React Hot Toast
    

## 📂 Getting Started

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
    
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
    

### 1. Clone the Repository

Bash

```
git clone https://github.com/your-username/skillsync.git
cd skillsync

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

Bash

```
cd backend
npm install

```

Environment Configuration:

Create a .env file in the backend root by copying the sample:

Bash

```
cp .env.sample .env

```

Open `.env` and fill in your specific credentials:

Code snippet

```
# Core
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Authentication
ACCESS_TOKEN_SECRET=your_super_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

```

Start the backend server:

Bash

```
# Development mode (with nodemon)
npm run dev

# Production start
npm start

```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

Bash

```
cd ../frontend
npm install

```

Start the frontend development server:

Bash

```
npm run dev

```

The application should now be running at `http://localhost:5173` (Vite default) with the backend at `http://localhost:5000`.

## 📜 Scripts

**Backend**

-   `npm run dev`: Runs the server with Nodemon for hot-reloading.
    
-   `npm start`: Runs the server in production mode.
    

**Frontend**

-   `npm run dev`: Starts the Vite development server.
    
-   `npm run build`: Builds the app for production.
    
-   `npm run lint`: Runs ESLint to check for code quality issues.
    
-   `npm run preview`: Previews the production build locally.
    

## 📄 License

This project is licensed under the MIT License.Here is the `README.md` for your **SkillSync** repository, based on the backend and frontend configuration files provided.

----------

# SkillSync

SkillSync is a full-stack web application designed to help users connect, collaborate, and manage projects. It features a robust Node.js/Express backend and a modern, responsive React frontend.

## 🚀 Features

-   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt.
    
-   **Project Management:** Create and manage projects (inferred from project structure).
    
-   **Media Handling:** Cloud-based image and media uploads via Cloudinary.
    
-   **Social Interactions:** Connect with other users (inferred from `social` components).
    
-   **Email Notifications:** Integrated SMTP support using Nodemailer.
    
-   **Responsive UI:** Built with React and Tailwind CSS for a seamless mobile and desktop experience.
    

## 🛠️ Tech Stack

### Backend

-   **Runtime:** Node.js
    
-   **Framework:** Express.js
    
-   **Database:** MongoDB (via Mongoose)
    
-   **Authentication:** JSON Web Token (JWT), Bcrypt
    
-   **File Storage:** Cloudinary (with Multer)
    
-   **Email:** Nodemailer
    

### Frontend

-   **Framework:** React (v19)
    
-   **Build Tool:** Vite
    
-   **Styling:** Tailwind CSS
    
-   **Routing:** React Router DOM
    
-   **HTTP Client:** Axios
    
-   **Notifications:** React Hot Toast
    

## 📂 Getting Started

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
    
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
    

### 1. Clone the Repository

Bash

```
git clone https://github.com/your-username/skillsync.git
cd skillsync

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

Bash

```
cd backend
npm install

```

Environment Configuration:

Create a .env file in the backend root by copying the sample:

Bash

```
cp .env.sample .env

```

Open `.env` and fill in your specific credentials:

Code snippet

```
# Core
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Authentication
ACCESS_TOKEN_SECRET=your_super_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

```

Start the backend server:

Bash

```
# Development mode (with nodemon)
npm run dev

# Production start
npm start

```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

Bash

```
cd ../frontend
npm install

```

Start the frontend development server:

Bash

```
npm run dev

```

The application should now be running at `http://localhost:5173` (Vite default) with the backend at `http://localhost:5000`.

## 📜 Scripts

**Backend**

-   `npm run dev`: Runs the server with Nodemon for hot-reloading.
    
-   `npm start`: Runs the server in production mode.
    

**Frontend**

-   `npm run dev`: Starts the Vite development server.
    
-   `npm run build`: Builds the app for production.
    
-   `npm run lint`: Runs ESLint to check for code quality issues.
    
-   `npm run preview`: Previews the production build locally.
    

## 📄 License

This project is licensed under the MIT License.

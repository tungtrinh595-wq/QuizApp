# 🧠 Quiz App

A full-stack MERN application that allows users to take quizzes, track results, and authenticate via Google or Facebook. Built with React + Vite on the frontend and Express + MongoDB on the backend.

---

## 🚀 Features

- 📝 Create and take quizzes
- 📊 View results and analytics
- 🔐 OAuth login via Google & Facebook
- 🧠 Admin dashboard for managing questions
- 🌐 RESTful API with JWT authentication
- 📦 MongoDB Atlas integration
- 🔔 Realtime updates via WebSocket (Socket.IO)

---

## 🧰 Tech Stack

| Layer         | Technology                     |
|---------------|--------------------------------|
| Frontend      | React + Vite                   |
| Backend       | Express + Node.js              |
| Realtime      | Socket.IO                      |
| Database      | MongoDB Atlas                  |
| Auth          | Google OAuth, Facebook OAuth   |
| Styling       | Tailwind CSS / Custom CSS      |
| Deployment    | Render (Free Tier)             |
| Media Storage | Cloudinary                     |

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash  
git clone https://bitbucket.org/tungtrinh595/quiz-app.git  
cd quiz-app  

### 2. Install dependencies
cd client && npm install  
cd ../server && npm install  
cd ../socket && npm install  

### 3. Create .env files
Before running the app, create environment files for both client and server:  

#### 🔧 `client/.env`
Copy from the sample:  

```bash  
cp client/.env.sample client/.env  
Fill in your API keys and base URL.  

#### 🔧 `server/.env`
Copy from the sample:  

```bash  
cp server/.env.sample server/.env  
Set up your MongoDB credentials, OAuth keys, Mailtrap config, and Cloudinary credentials.  

#### 🔧 `socket/.env`
Copy from the sample:  

```bash  
cp socket/.env.sample socket/.env  
Set up your PORT and any secret keys for token verification.  

⚠️ Make sure sensitive keys are kept secret and never committed to version control.  

### 4. Run locally
#### Start backend
cd server  
npm run dev  

#### Start frontend
cd ../client  
npm run dev  

#### Start socket server
cd ../socket  
npm run dev  

### 4. Or run locally with docker
docker compose build --no-cache  
docker compose up  

---

🌍 Deployment  
This app is deployed on Render using Free Tier.  

| Service   | Type           | URL                                     |
|-----------|----------------|-----------------------------------------|
| Frontend  | Static Site    | https://quiz-frontend-g0tl.onrender.com |
| Backend   | Web Service    | https://quiz-backend-k5yi.onrender.com  |
| Socket    | Web Service    | https://quiz-socket.onrender.com        |
| Database  | MongoDB Atlas  | Cloud-hosted MongoDB cluster            |

---

🧪 Testing  
Coming soon...

---

🙋‍♂️ Author
Trịnh Văn Tùng  
📫 Email (mailto: tung.trinh.595@gmail.com)  
🌐 Bitbucket Profile `@tungtrinh595` (private profile)  
📱 Zalo: 0397027361  
🌐 Facebook: [fb.com/TH55132230](https://www.facebook.com/TH55132230)  
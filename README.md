# 💸 Pay-Money

A **full-stack payment management system** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It allows users to manage transactions, handle authentication securely, and interact with a smooth frontend interface.  

🚀 **Deployed Links**  
- **Frontend (Vercel):** [Pay-Money Frontend](https://pay-money-three.vercel.app/)  
- **Backend (Railway):** [Pay-Money Backend](https://your-railway-backend-url)  

---

## ✨ Features

✅ User Authentication with JWT & Bcrypt  
✅ Secure Payment Workflow  
✅ Transaction History & Logs  
✅ RESTful API Architecture  
✅ Responsive UI for seamless experience  
✅ Environment variable support using **dotenv**  
✅ Scalable deployment on **Vercel** (frontend) & **Railway** (backend)  

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS (if included)  
- Axios  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Bcrypt (password hashing)  
- dotenv  

**Deployment:**  
- Vercel (Frontend)  
- Railway (Backend)  

---

## 📂 Project Structure

```
Pay-Money/
├── backend/            # Express.js + MongoDB server
│   ├── app.js          # Entry point
│   ├── routes/         # API routes
│   └── Middleware/          # Helper functions
├── frontend/           # React.js client
│   ├── src/            # React components & pages
│   └── public/         # Static assets
├── .gitignore
├── README.md           # Project documentation
└── package.json
```

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- [Node.js](https://nodejs.org/) installed  
- [MongoDB](https://www.mongodb.com/) running locally or on Atlas  
- Railway & Vercel accounts (for deployment)  

### 🔹 Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside **backend/**:
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:
```bash
npm start
```

### 🔹 Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push frontend code to GitHub  
2. Import repo in Vercel  
3. Configure build command: `npm run build`  
4. Deploy 🚀  

### Backend (Railway)
1. Push backend code to GitHub  
2. Link Railway to repo  
3. Add environment variables in Railway dashboard  
4. Deploy 🚀  

---

## 🤝 Contribution

Contributions are welcome! Follow these steps:  
1. Fork the repository  
2. Create a new branch (`feature-xyz`)  
3. Commit changes (`git commit -m 'Added new feature'`)  
4. Push to branch  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License**.  

---

## 👨‍💻 Authors

- **Abhishek Kumar Pandey**

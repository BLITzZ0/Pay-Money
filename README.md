# Pay-Money

A full-stack **peer-to-peer payment simulation** built with the **MERN stack** (MongoDB, Express, React, Node.js). Users sign up, receive a random starting balance, search for other users, send money, and review their transaction history, all behind JWT authentication, with email-OTP password recovery.

> **Disclaimer:** Pay-Money is a learning/demo project. It moves **virtual money only** and is not connected to any real bank or payment gateway.

**Live demo (frontend):** [pay-money-three.vercel.app](https://pay-money-three.vercel.app/)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Data Models](#data-models)
6. [API Reference](#api-reference)
7. [Frontend Routes](#frontend-routes)
8. [Getting Started](#getting-started)
9. [Environment Variables](#environment-variables)
10. [Deployment](#deployment)
11. [How Key Flows Work](#how-key-flows-work)
12. [Known Limitations](#known-limitations)
13. [Contributing](#contributing)
14. [License & Author](#license--author)

---

## Features

- **Account registration & login**: email as username, passwords hashed with `bcrypt`, sessions via JWT (1-hour expiry).
- **Random starting balance**: each new account is seeded with a random amount (up to 10,000 currency units).
- **User search**: find other users by first name, last name, or email (case-insensitive regex search).
- **Send money**: atomic transfers using **MongoDB multi-document transactions** (debit + credit + ledger entry commit together or not at all).
- **Transaction history**: combined sent/received list, newest first, with filters (All / Received / Sent).
- **Failed-transaction logging**: failed transfers (e.g. insufficient balance) are recorded with a reason.
- **Forgot password with OTP**: 6-digit OTP emailed via Brevo (Sendinblue), stored hashed, expires in 5 minutes (TTL index).
- **Input validation** on the backend using `zod`.
- **Protected routes** on the frontend: expired/invalid tokens redirect to login.
- **Responsive UI** built with Tailwind CSS v4, with SweetAlert2 dialogs for feedback.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 7, React Router 7, Tailwind CSS 4, Axios, jwt-decode, SweetAlert2, lucide-react |
| **Backend** | Node.js, Express 5, Mongoose 8, Zod 4, bcrypt, jsonwebtoken, cors, dotenv |
| **Email** | Brevo (`@sendinblue/client`) for transactional OTP emails |
| **Database** | MongoDB (replica set / Atlas required for transactions) |
| **Hosting** | Vercel (frontend, SPA rewrite via `vercel.json`) |

---

## Architecture

```
React SPA (Vite)                          Express REST API
- Pages / Components   -- HTTPS/JSON -->  /api/v1/user/*
- JWT in localStorage  Authorization:     /api/v1/account/*
                       Bearer <token>     - Zod validation
                                          - JWT auth middleware
                                                |          |
                                       Mongoose |          | Brevo API
                                                v          v
                                        MongoDB          Email (OTP)
                                        - User
                                        - Account
                                        - Transaction
                                        - Otp (TTL)
```

---

## Project Structure

```
Pay-Money/
|-- backend/
|   |-- app.js                  # Express entry point, routers, CORS, JSON parser
|   |-- db.js                   # Mongo connection + User, Account, Transaction, Otp models
|   |-- Middleware/
|   |   |-- AuthMiddleware.js   # JWT verification (Bearer token)
|   |   `-- Mailer.js           # Brevo transactional email helper
|   |-- routes/
|   |   |-- index.js            # Combines /user and /account routers
|   |   |-- User.js             # Signup, login, update, search, forgot/reset password
|   |   `-- Account.js          # Balance, transfer, transaction history
|   `-- package.json
|
|-- frontend/
|   |-- index.html
|   |-- vite.config.js          # React + Tailwind (Vite plugin)
|   |-- vercel.json             # SPA rewrite so deep links work on Vercel
|   `-- src/
|       |-- main.jsx, App.jsx   # Entry + React Router configuration
|       |-- pages/
|       |   |-- LandingPage.jsx
|       |   |-- SignupForm.jsx
|       |   |-- Login.jsx
|       |   |-- ForgetPassword.jsx   # 3 steps: email, OTP, new password
|       |   |-- Dashboard.jsx        # Balance + user search
|       |   |-- SendMoney.jsx
|       |   `-- Transactions.jsx
|       `-- components/         # AppBar, Balance, Users, InputBox, OtpBox, Button, ...
|
|-- .gitignore
`-- README.md
```

---

## Data Models

Defined in `backend/db.js`.

| Model | Fields | Notes |
|-------|--------|-------|
| **User** | `User_name` (unique email, lowercase, 3–30 chars), `Password` (bcrypt hash), `first_name`, `Last_name` | |
| **Account** | `userId` (ref User), `balance` (Number) | Balance is stored in **minor units** (×100) and divided by 100 in API responses |
| **Transaction** | `transactionId` (unique, `TXN-<timestamp>-<uuid>`), `from`, `to` (ref User), `amount` (minor units), `time`, `status` (`success` \| `failed` \| `pending`), `reason` | Failed transfers are logged with a reason |
| **Otp** | `email`, `otp` (bcrypt hash), `expiresAt` | TTL index (`expireAfterSeconds: 0`) auto-deletes expired OTPs |

---

## API Reference

**Base URL:** `http://localhost:<PORT>/api/v1`

Protected endpoints require the header: `Authorization: Bearer <JWT>`

### User endpoints: `/api/v1/user`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/add_user` |  | Register a user, create an account with a random balance, return a JWT |
| `POST` | `/login_user` |  | Authenticate and return a JWT |
| `PUT` | `/update_user` |  | Update `first_name`, `Last_name`, and/or `Password` |
| `GET` | `/bulk?filter=<text>` |  | Search users by first name, last name, or email |
| `POST` | `/forget-password` |  | Generate an OTP and email it to the user |
| `POST` | `/reset-password` |  | Verify OTP and set a new password |

**Signup body**
```json
{
  "User_name": "john@example.com",
  "first_name": "John",
  "Last_name": "Doe",
  "Password": "minimum8chars"
}
```

**Login body**
```json
{ "User_name": "john@example.com", "Password": "minimum8chars" }
```

**Reset-password body** (password must contain upper, lower, digit and one of `? ! @ # $ % & *`)
```json
{ "email": "john@example.com", "otp": "123456", "newPassword": "NewPass@123" }
```

### Account endpoints: `/api/v1/account`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/balance` |  | Returns `{ "Balance": <number> }` for the logged-in user |
| `POST` | `/transfer` |  | Transfer money to another user (atomic) |
| `POST` | `/transactions` |  | Returns merged sent + received transactions, newest first |

**Transfer body**
```json
{ "to": "jane@example.com", "amount": 250 }
```

**Transfer success response**
```json
{ "Message": "Transaction successful", "transactionId": "TXN-1727000000000-<uuid>" }
```

**Transactions response (shape)**
```json
{
  "transactions": [
    { "id": "TXN-...", "counterparty": "jane@example.com", "amount": 250, "status": "success", "type": "debit", "time": "2026-09-24T10:00:00.000Z" }
  ]
}
```

### Common status codes

| Code | Meaning |
|------|---------|
| `200 / 201` | Success / created |
| `400` | Validation failure, business-rule failure (insufficient balance, self-transfer, unknown receiver), bad/missing token |
| `401` | Invalid password |
| `404` | Resource not found (user, account, or no transactions) |
| `500` | Server error |

---

## Frontend Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Landing page | Public |
| `/signup` | Create account | Public |
| `/login` | Log in | Public |
| `/forget-password` | 3-step password reset (email, OTP, new password) | Public |
| `/dashboard` | Balance + searchable user list | Requires token |
| `/sendmoney?name=..&username=..` | Send money to a selected user | Requires token |
| `/transactions` | History with All / Received / Sent filters | Requires token |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- A **MongoDB** deployment that supports transactions: **MongoDB Atlas** (recommended) or a local **replica set**. A standalone local `mongod` will make transfers fail.
- A **[Brevo](https://www.brevo.com/)** account and API key (only needed for the password-reset OTP email)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Pay-Money
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start          # node app.js
# or, for auto-reload during development:
npx nodemon app.js
```

You should see `Connection SucessFull` and `App is running in port ...`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Frontend scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Environment Variables

### `backend/.env`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `PORT` |  | Port for the Express server (e.g. `5000`) |
| `MONGO_URI` |  | MongoDB connection string |
| `JWT_SECRET` |  | Secret used to sign/verify JWTs. Use a long random string |
| `BREVO_API_KEY` | For OTP emails | Brevo (Sendinblue) transactional email API key |

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=replace_with_a_long_random_string
BREVO_API_KEY=your_brevo_api_key
```

### `frontend/.env`

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` |  | Base URL of the backend, **without** trailing slash or `/api/v1` |

> `.env` files are git-ignored. Never commit real secrets.

---

## Deployment

**Frontend (Vercel)**
1. Import the repo in Vercel and set the **root directory** to `frontend`.
2. Build command: `npm run build`, output directory: `dist`.
3. Add `VITE_API_URL` pointing at your deployed backend.
4. `vercel.json` already rewrites all routes to `/` so client-side routing works on refresh.

**Backend (any Node host, e.g. Railway / Render)**
1. Set the root directory to `backend` and start command to `npm start`.
2. Add `PORT` (if not injected by the host), `MONGO_URI`, `JWT_SECRET`, and `BREVO_API_KEY`.
3. Point the frontend's `VITE_API_URL` at the resulting public URL.

---

## How Key Flows Work

**Signup:** Zod validates input  duplicate check  password hashed (bcrypt, 10 rounds)  `User` saved  `Account` created with a random balance  JWT returned and stored in `localStorage`.

**Transfer (`/account/transfer`):**
1. Validate body (`to` string, `amount` positive finite number).
2. Start a MongoDB session/transaction.
3. Load sender account, receiver user and account; reject self-transfers and insufficient balance.
4. `$inc` sender by `-amount×100` and receiver by `+amount×100`; create a `Transaction` document.
5. Commit. On any error, abort and log a `failed` transaction with the reason.

**Password reset:** `/forget-password` generates a 6-digit OTP, stores its bcrypt hash with a 5-minute expiry (auto-purged by a TTL index), and emails it. The frontend collects the OTP, then `/reset-password` verifies it and applies the new password (which must meet the complexity rules).

**Route protection:** pages read the JWT from `localStorage`, decode it with `jwt-decode`, and redirect to `/login` if it is missing, malformed, or expired.

---

## Known Limitations

- `/update_user` returns the password hash in its response.
- `Account.js` assigns `to` and `transactionId` without declaring them.
- The `/bulk` filter is passed straight into a regex; escape it.
- The Brevo sender email is hard-coded in `Middleware/Mailer.js`.
- The login password field is not masked.
- JWTs are stored in `localStorage`; consider httpOnly cookies, stricter CORS and rate limiting.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License & Author

Released under the **MIT License**.

**Author:** Abhishek Kumar Pandey

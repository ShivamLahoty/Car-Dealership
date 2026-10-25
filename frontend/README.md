<div align="center">

# 🚗 AutoHub

### Car Dealership Inventory System

A full-stack app to manage a car dealership's inventory. Customers browse, search, buy vehicles and see their purchase history. Admins add, edit, delete and restock them.

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,nodejs,express,sqlite,jest,docker,vercel,git,github" alt="tech stack icons" />

<br />

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

### 🌐 Live demo

**Frontend:** [frontend-three-brown-u3w0adpf2d.vercel.app](https://frontend-three-brown-u3w0adpf2d.vercel.app)
**API health check:** [car-dealership-mhlq.onrender.com/api/health](https://car-dealership-mhlq.onrender.com/api/health)

Admin login: `admin@dealership.com` / `admin123`, or register as a customer.

> The backend runs on a free Render instance, so the first request can take up to a minute while it wakes up. The database resets whenever the service restarts, so data in the demo is not permanent.

</div>

---

## 📸 Screenshots

| Login | Dashboard |
|:---:|:---:|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Admin view | My purchases |
|:---:|:---:|
| ![Admin](docs/screenshots/admin.png) | ![My purchases](docs/screenshots/purchases.png) |

| Mobile |
|:---:|
| ![Mobile](docs/screenshots/mobile.png) |

---

## ✨ Features

**Everyone**
- 🔐 Register and log in with JWT authentication
- 🚘 Dashboard listing every vehicle with its stock status and price in ₹
- 🔎 Search by make, model, category and price range
- 🛒 Purchase button that is disabled when a vehicle is out of stock

**Customers**
- 📦 "My Purchases" page with the full purchase history and the total spent

**Admins**
- 🛠️ Add, edit and delete vehicles
- 📈 Restock vehicles

The layout is responsive and works on phones.

---

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite (file based, via better-sqlite3) |
| Auth | JWT, bcryptjs |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Render with Docker (backend) |

---

## 🔌 API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/vehicles` | Logged in |
| GET | `/api/vehicles/search` | Logged in |
| POST | `/api/vehicles` | Logged in |
| PUT | `/api/vehicles/:id` | Logged in |
| DELETE | `/api/vehicles/:id` | Admin |
| POST | `/api/vehicles/:id/purchase` | Logged in |
| POST | `/api/vehicles/:id/restock` | Admin |
| GET | `/api/purchases` | Logged in (own purchases only) |
| GET | `/api/health` | Public |

Search query parameters: `make`, `model`, `category`, `minPrice`, `maxPrice`.
Protected routes need the header `Authorization: Bearer <token>`.

---

## 🚀 Running it locally

You need **Node.js 22 or newer** (the `better-sqlite3` version used here requires it).

```bash
git clone https://github.com/ShivamLahoty/Car-Dealership.git
cd Car-Dealership
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy `.env.example`):

```
PORT=5000
JWT_SECRET=any-long-random-string
```

You can generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add the sample data and start the server:

```bash
npm run seed
npm run dev
```

The API runs on `http://localhost:5000`. The seed script replaces the vehicles with 8 sample cars (prices in ₹) and creates an admin account:

> **Admin login:** `admin@dealership.com` / `admin123`

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. By default the app calls the API on `http://localhost:5000/api`. To use a different API, create `frontend/.env.local` with:

```
VITE_API_URL=http://your-api/api
```

---

## 🧪 Tests

```bash
cd backend
npm test
npm run test:coverage
```

9 test suites cover auth, the middleware, vehicle CRUD, search, purchase, restock and purchase history. Each test file uses its own temporary SQLite database, which is deleted at the start of the next run.

### Test report

```
PASTE the output of npm run test:coverage here
```

---

## ☁️ Deployment

- **Frontend:** Vercel, with the root directory set to `frontend`. It needs one environment variable, `VITE_API_URL`, set to `https://<backend-url>/api`. `frontend/vercel.json` rewrites every route to `index.html` so React Router works on refresh.
- **Backend:** Render, as a Docker web service built from `backend/Dockerfile`. It needs `JWT_SECRET`. The container runs the seed script and then starts the server.

To build the backend image locally, run this from the repo root (the Dockerfile copies from `backend/`):

```bash
docker build -f backend/Dockerfile -t autohub-api .
docker run -p 5000:10000 -e PORT=10000 -e JWT_SECRET=change-me autohub-api
```

---

## 🗂️ Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── routes/        auth, vehicle and purchase routes
│   │   ├── services/      database logic
│   │   ├── middleware/    jwt check and admin check
│   │   ├── validators/    vehicle input validation
│   │   ├── app.ts         express app
│   │   ├── server.ts      entry point
│   │   ├── db.ts          sqlite connection and tables
│   │   └── seed.ts        sample data and admin account
│   ├── tests/             jest and supertest suites
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/         login, register, dashboard, my purchases
│   │   ├── components/    navbar, search bar, vehicle card and form
│   │   ├── context/       auth state
│   │   ├── api.ts         axios setup with the token header
│   │   ├── types.ts       shared types
│   │   └── format.ts      rupee and date formatting
│   └── vercel.json
├── docs/screenshots/      images used in this README
├── PROMPTS.md             prompts I used with the AI
└── README.md
```

---

## 📝 Notes and decisions

- **Admin registration:** the register form lets you pick the Admin role. It is a shortcut so the admin features are easy to test. A real app would never allow it.
- **Who can add and edit:** the brief only makes delete and restock admin-only, so any logged-in user can call `POST` and `PUT` on vehicles through the API. The UI shows those controls to admins only.
- **Out-of-stock vehicles are listed:** the dashboard shows them with a disabled Purchase button, as the brief asks for that button state.
- **Purchases are atomic:** one SQL update that only succeeds if enough stock is left, so stock can never go below zero.
- **Purchase history keeps a copy of the make, model and price** at the time of sale, so it stays correct if an admin later edits or deletes the vehicle.
- **Free hosting limits:** the demo's SQLite file lives on a free Render instance without a persistent disk, so all data resets when the service restarts. The seed script restores the sample cars and the admin account on every start.
- **Commit history:** the health check, registration, auth middleware, vehicle endpoints and purchase history were test-first. Login and some later backend features were committed together after I ran into setup problems.

---

## 🤖 My AI Usage

**Tool used:** Claude (Anthropic), through the claude.ai chat. No other AI tools. My prompts are in [PROMPTS.md](PROMPTS.md).

**How I used it**
- Planning the stack, the folder layout and the commit plan
- Generating most of the backend code and tests (auth, middleware, vehicle routes, search, purchase, restock, purchase history) and the React frontend, in small parts that I committed one at a time
- Debugging errors that I pasted into the chat, including the deployment errors
- The rupee formatting and the "My Purchases" feature, after I noticed that customers had no way to see what they bought

**What I did myself**
- Set up the environment and ran every command
- Ran the tests and the app after each step, and tested the whole UI in the browser
- Found and fixed problems on my machine: the TypeScript 7 incompatibility with ts-jest, a filename casing error, the Windows file lock on the test database, a misspelled filename, a wrong file extension, and a missing login endpoint that a token test exposed
- Deployed the app: set up Render and Vercel, and worked through the deploy errors by reading the logs (a wrongly cased `Dockerfile` name, the Docker build context, and the Node version that `better-sqlite3` requires)
- Decided what was missing from the app (the purchase history and the rupee prices) and asked for it
- Took the screenshots and wrote commit messages that say where AI helped

**Reflection:** (replace this with your own words) AI saved a lot of time on boilerplate and let me build a full-stack project in a short time. But the code didn't work out of the box on my machine or on the host, so I had to read error messages and logs and work out what was wrong, which taught me how Jest, TypeScript, Docker and deployment paths behave. Running the tests after every step is how I caught the missing login endpoint. Next time I would write more of the tests myself first, so the tests drive the design instead of confirming code that already exists.
# 💸 Expenzo - Track Smart. Spend Bold!

<div align="center">
  <h3>Gen-Z Themed Smart Expense Tracker for HeisenHack 2024</h3>
  <p>A funky, colorful, and AI-assisted expense tracking app that helps users manage their finances with style!</p>
  
  [![Made for HeisenHack](https://img.shields.io/badge/Made%20for-HeisenHack%202024-FFC300?style=for-the-badge&logo=hackster)](https://heisenhack.com)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
</div>

---

## 🎯 About Expenzo

Expenzo is a **Gen-Z themed expense tracker** built for the 36-hour **HeisenHack** hackathon. It combines smart automation with a playful UI inspired by the HeisenHack poster aesthetic (yellow, teal, black, cartoon vibes).

### ✨ Key Features

- **🔐 Smart Authentication** - JWT-based secure login/register
- **💰 Expense Management** - Add, edit, delete, and filter expenses
- **📊 Visual Analytics** - Interactive charts with Chart.js
- **🤖 AI Insights** - Smart spending pattern analysis
- **👥 Group Bills** - Split expenses with friends
- **📱 Mobile-First** - Responsive design for all devices
- **🎨 Gen-Z Theme** - Vibrant colors and funky animations
- **🌙 Dark Mode** - Toggle between light and dark themes

---

## 🧱 Tech Stack

### Frontend

- **React 18.2** + **Vite** - Lightning-fast development
- **TailwindCSS** - Utility-first styling with custom HeisenHack theme
- **Chart.js** + **React-ChartJS-2** - Beautiful data visualizations
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Elegant notifications

### Backend

- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - NoSQL database with ODM
- **JWT** + **bcryptjs** - Authentication and password hashing
- **Express Rate Limit** - API protection
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Optional Integrations

- **OpenAI API** - AI-powered expense insights
- **Chart.js** - Advanced data visualizations

---

## 🎨 Design Theme

**HeisenHack-Inspired Color Palette:**

- **Primary:** `#FFC300` (Vibrant Yellow) 🟡
- **Secondary:** `#2ECCB0` (Teal Green) 🟢
- **Accent:** `#00AEEF` (Electric Blue) 🔵
- **Dark Base:** `#121212` (Matte Black) ⚫
- **Background:** `#FFF8E7` (Soft Cream) 🟨

**Typography:**

- **Headings:** Bungee / Poppins ExtraBold
- **Body:** Inter / Nunito

**UI Elements:**

- Rounded cards with `border-radius: 1.5rem`
- Playful emojis and funky icons (💰📊🍕🚕)
- Light motion and hover animations
- Glow effects and shadows

---

## 📦 Project Structure

```
EXPENZO/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # TailwindCSS configuration
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **MongoDB** (local or Atlas)
- **Git**

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd EXPENZO
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expenzo
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=12
```

---

## 🧩 Features Implementation

### ✅ Completed Features

1. **Project Structure** - Full-stack setup with React + Node.js
2. **Authentication System** - JWT-based login/register
3. **Expense CRUD** - Add, edit, delete, view expenses
4. **Dashboard** - Summary cards and charts
5. **UI Components** - Funky Gen-Z themed components
6. **Responsive Design** - Mobile-first approach

### 🚧 In Progress

- **AI Insights** - Smart spending analysis
- **Group Bills** - Split expenses with friends
- **Chart Visualizations** - Advanced analytics
- **SMS Detection** - Extract expenses from text

### 📝 Planned Features

- **Export Functionality** - CSV/PDF reports
- **Daily Reminders** - Expense tracking notifications
- **Budget Alerts** - Smart spending limits
- **Dark Mode** - Theme toggle

---

## 🎪 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Expenses

- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### Groups

- `GET /api/groups` - Get user groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/expenses` - Add group expense
- `GET /api/groups/:id/settlements` - Calculate settlements

### Insights

- `GET /api/insights/summary` - Spending summary
- `GET /api/insights/ai` - AI-generated insights

---

## 🎨 Component Library

### Core Components

- **Navbar** - Navigation with Expenzo branding
- **ExpenseCard** - Individual expense display
- **ChartSection** - Data visualization wrapper
- **AddModal** - Expense creation modal
- **BudgetTracker** - Progress visualization
- **LoadingSpinner** - Funky loading animation

### UI Elements

- **Button** - Primary, secondary, outline variants
- **Card** - Rounded cards with hover effects
- **Input** - Fields with emoji placeholders
- **Badge** - Category and status indicators

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)

```bash
cd backend
# Deploy to Render or Railway
```

### Database (MongoDB Atlas)

- Create cluster on MongoDB Atlas
- Update connection string in `.env`

---

## 🎯 Hackathon Demo Script

1. **Landing Page** - Showcase funky UI and branding
2. **Authentication** - Quick register/login demo
3. **Add Expense** - Show SMS detection feature
4. **Dashboard** - Real-time chart updates
5. **AI Insights** - Smart spending analysis
6. **Mobile View** - Responsive design demo

---

## 🎊 Fun Facts

- **36 hours** of coding for HeisenHack 2024
- **Gen-Z themed** with emojis and vibrant colors
- **Mobile-first** design approach
- **AI-powered** expense insights
- **Open source** and hackathon-ready

---

## 🤝 Contributing

This project was built for **HeisenHack 2024**. Feel free to fork, improve, and make it even more funky!

### Team

- **PAARTH DUTTA** - Full-Stack Development 🎨
- **[Add team members]** - [Add roles]

---

## 🎮 Demo Status

✅ **Frontend Server**: Running on `http://localhost:5175/`  
✅ **Backend Server**: Running on `http://localhost:5000/`  
✅ **Authentication**: JWT-based auth system  
✅ **UI Components**: Complete Gen-Z themed components  
✅ **Expense Management**: Add/Edit/Delete/View expenses  
✅ **Chart Integration**: Chart.js visualizations ready  
⚠️ **Database**: Requires MongoDB setup for full functionality

---

## 📄 License

MIT License - Built with 💖 for HeisenHack 2024

---

<div align="center">
  <h2>💸 Track Smart. Spend Bold! 🎯</h2>
  <p>Made with ☕ and lots of 🎵 during HeisenHack 2024</p>
</div>

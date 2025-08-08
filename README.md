# Website Link

https://done-desk.vercel.app/

# 📝 DoneDesk - Task Manager App

DoneDesk is a full-featured task management application designed for teams and individuals to organize, track, and manage tasks efficiently. It includes dashboards, user roles, detailed reporting, and rich UI components.

---

## 🚀 Features

- ✅ Authentication (Login/Signup with validation)
- 👤 Role-based Dashboard (Admin/User)
- 🧾 Task CRUD (Create, Read, Update, Delete)
- 📊 Dashboard Analytics (Pie & Bar Charts)
- 📥 File Upload & Attachments
- ⏳ Task Status & Priority Filters
- 📌 Todo Checklist for each task
- 👥 Team Management (View all users)
- 📈 Export Reports (Tasks & Users)
- 🔐 JWT-based secure API access
- ⚙️ Admin Panel with Controls

---

## 🛠 Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Moment.js
- Recharts (Chart.js alternative)

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary (for file/image uploads)
- JWT Authentication
- Firebase (for OTP-based auth - optional)

---

## 📂 Folder Structure

```
src/
├── assets/         # Images, icons
├── components/     # Reusable components (Cards, Charts, Loader, etc.)
├── context/        # Context API for user/session state
├── hooks/          # Custom hooks (e.g., auth)
├── layouts/        # Layouts for Auth & Dashboard
├── pages/          # Page-level components
│   ├── auth/       # Login/Register
│   ├── admin/      # Admin Dashboard & Task Management
│   ├── user/       # User Dashboard & Task View
├── utils/          # Axios config, API paths, helpers
└── App.jsx         # Entry point
```

---

## 🖥️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mayank3345/DoneDesk.git
cd donedesk
```

---

### 2. Install frontend dependencies & run

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file at the root of the frontend if needed:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3. Setup and Run Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside `backend/` with the following content:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=9670664781
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔗 Deployment

Deploy this app on:

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🙋 Author

**Mayank Singh**  
📧 [adimayank55@gmail.com](mailto:adimayank55@gmail.com)

<!-- ← Update your profile URL -->

# 🏢 Meeting Room Booking System (React)

A modern frontend application for a Meeting Room Booking System built with **React + Vite**. It allows users to view rooms, create bookings, and manage schedules while preventing time conflicts.

---

## 🚀 Features

- View meeting rooms
- Create new bookings
- Prevent overlapping bookings
- Validate time selection
- Clean and responsive UI
- API integration with backend

---

## 🧱 Tech Stack

- React (Vite)
- React Router
- Tailwind CSS 

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

VITE_API_URL=http://localhost:4000

---

## 📦 Installation & Setup

git clone https://github.com/htay-htay-thwe/booking-meeting-room-react.git
cd booking-meeting-room-react
npm install

---

## ▶️ Run Project

npm run dev

App runs at:
http://localhost:5173

---

## 🔗 Backend Connection

This frontend connects to the Node.js backend:

- Booking API: POST /api/bookings
- Handles booking validation and overlap checking

---

## 📌 Main Features Flow

1. User selects a meeting room
2. User chooses start and end time
3. System checks availability via API
4. Booking is created if no conflict exists

---

## ❌ Error Handling

- 400 → Invalid input
- 409 → Overlapping booking
- 500 → Server error

---

## 👨‍💻 Author

Htay Htay Thwe  
GitHub: https://github.com/htay-htay-thwe

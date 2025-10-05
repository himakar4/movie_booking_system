# 🎬 Movie Booking System

A full-stack **Movie Booking System** built with **React (Frontend)**, **Node.js + Express (Backend)**, and **MySQL (Database)**.  
This project allows users to browse movies, view showtimes, and book seats — with booked seats visible to all users in real-time.

---

## 🧠 Tech Stack

**Frontend:** React.js, Axios, CSS  
**Backend:** Node.js, Express.js  
**Database:** MySQL (XAMPP for local setup)  
**Version Control:** Git & GitHub  

---

## ⚙️ Local Setup Instructions

Follow these steps to run the project **locally** on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Movie_Booking_System.git
cd Movie_Booking_System
```

---

### 2. Set Up the Database (MySQL via XAMPP)

1. Start **Apache** and **MySQL** from XAMPP Control Panel.  
2. Open **phpMyAdmin** → Create a new database named:
   ```
   movie_booking
   ```
3. Import the provided SQL file:
   ```
   database.sql
   ```
4. Update your backend `.env` file (inside `mbsback/`) with the following:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=movie_booking
   PORT=5000
   ```

---

### 3. Run the Backend Server

```bash
cd mbsback
npm install
node server.js
```

The backend runs at:  
👉 `http://localhost:5000`

---

### 4. Run the Frontend (React)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs at:  
👉 `http://localhost:3000`

---

### 5. Booking Logic

- A user can **book up to 6 seats** per show.
- Once seats are booked, they appear **blocked for all users**.
- Booked seats are fetched dynamically from the database.

---

## 🗄️ Database Schema

### **Tables Overview**

#### 1. `movies`
| Column | Type | Description |
|--------|------|--------------|
| id | INT (PK) | Unique movie ID |
| title | VARCHAR | Movie name |
| duration | VARCHAR | Duration/time |
| description | TEXT | Movie details |

#### 2. `shows`
| Column | Type | Description |
|--------|------|--------------|
| id | INT (PK) | Unique show ID |
| movie_id | INT (FK) | Linked to `movies.id` |
| show_time | TIME | Show timing |

#### 3. `bookings`
| Column | Type | Description |
|--------|------|--------------|
| id | INT (PK) | Unique booking ID |
| show_id | INT (FK) | Linked to `shows.id` |
| seats | VARCHAR | Comma-separated seat numbers |
| user | VARCHAR | Name or email of the user |

---

## 🧪 Testing Locally

After running both servers:
1. Visit `http://localhost:3000`
2. Select a movie and showtime.
3. Choose up to 6 seats and book them.
4. Refresh the page → the booked seats should remain blocked.

---

## 📁 Folder Structure

```
Movie_Booking_System/
│
├── frontend/           # React frontend
├── mbsback/            # Node.js backend
├── database.sql        # MySQL schema + sample data
└── README.md           # Documentation
```

---

## 💡 Future Improvements

- Add authentication (JWT)
- Integrate payment gateway
- Admin panel for managing shows and bookings
- Cloud hosting (Render + Vercel + PlanetScale)

---



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

### 1. `users`
Stores all registered users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Unique user ID |
| `name` | VARCHAR(100) | User's full name |
| `email` | VARCHAR(100) | Unique user email |
| `password` | VARCHAR(255) | Hashed user password |
| `created_at` | TIMESTAMP | Account creation time |

---

### 2. `cinemas`
Represents theaters where movies are shown.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Cinema ID |
| `name` | VARCHAR(100) | Name of the cinema |
| `location` | VARCHAR(100) | City or area of the cinema |

---

### 3. `movies`
Contains details about available movies.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Movie ID |
| `title` | VARCHAR(200) | Movie title |
| `duration` | INT | Duration in minutes |
| `genre` | VARCHAR(100) | Genre (e.g., Action, Drama) |
| `rating` | VARCHAR(10) | Certification (U, UA, A) |
| `release_date` | DATE | Official release date |
| `actors` | VARCHAR(255) | Comma-separated actor names |
| `poster` | VARCHAR(255) | Poster image path or URL |
| `description` | TEXT | Movie summary |

---

### 4. `languages`
Stores supported languages for movies.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Language ID |
| `name` | VARCHAR(50) | Language name (e.g., English, Hindi) |

---

### 5. `movie_languages`
Many-to-many relationship between movies and languages.

| Column | Type | Description |
|--------|------|-------------|
| `movie_id` | INT (FK → movies.id) | Movie ID |
| `language_id` | INT (FK → languages.id) | Language ID |

Each movie can have multiple languages, and each language can apply to multiple movies.

---

### 6. `shows`
Represents a movie playing at a specific cinema and time.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Show ID |
| `movie_id` | INT (FK → movies.id) | Linked movie |
| `cinema_id` | INT (FK → cinemas.id) | Linked cinema |
| `show_time` | DATETIME | Date and time of the show |

---

### 7. `bookings`
Tracks which user booked which show and which seats.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Booking ID |
| `user_id` | INT (FK → users.id) | Who made the booking |
| `show_id` | INT (FK → shows.id) | Which show was booked |
| `seats` | VARCHAR(255) | Comma-separated seat numbers (e.g., A1,A2,A3) |
| `booked_at` | TIMESTAMP | Booking creation timestamp |

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
<img width="1920" height="1080" alt="Screenshot (157)" src="https://github.com/user-attachments/assets/37ec48e8-1e61-462d-8f83-71b1ffefc270" />
<img width="1920" height="1080" alt="Screenshot (158)" src="https://github.com/user-attachments/assets/701fd27a-f6e2-4d7f-814a-1dbaef103efd" />
<img width="1920" height="1080" alt="Screenshot (159)" src="https://github.com/user-attachments/assets/3eba7340-e61d-413a-86f7-235df67e1dde" />
<img width="1920" height="1080" alt="Screenshot (160)" src="https://github.com/user-attachments/assets/4e21a774-7fd5-4dc3-991c-7b4d3181a0f3" />


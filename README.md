### 📌 **README.md for Task Management API**

````md
# 🚀 Task Management API

This is a **RESTful API** for managing tasks, built using **Node.js, Express, MongoDB, and JWT authentication**.  
It supports **user authentication, task CRUD operations, filtering, pagination, and task scheduling**.

---

## 📌 Features

✅ **User Authentication (JWT-based login & logout)**  
✅ **Task CRUD operations (Create, Read, Update, Delete)**  
✅ **Pagination & Filtering (status & priority)**  
✅ **Task Scheduling (Sort by priority & timestamp)**  
✅ **Input Validation using `validator.js`**  
✅ **Secure API with authentication middleware**

---

## 📌 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Validator.js
- **Task Scheduling:** Min-Heap Priority Queue

---

## 📌 Installation & Setup

### 1️⃣ **Clone the repository**

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/task-management-api.git
cd task-management-api
```
````

### 2️⃣ **Install dependencies**

```sh
npm install
```

### 3️⃣ **Set up environment variables**

Create a `.env` file in the root folder and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your_jwt_secret
```

### 4️⃣ **Start the server**

```sh
npm run dev  # Start with nodemon
# OR
npm start    # Start with Node.js
```

---

## 📌 API Endpoints

### 🔹 **Authentication**

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| `POST` | `/auth/register` | Register a new user        |
| `POST` | `/auth/login`    | User login & get JWT token |
| `POST` | `/auth/logout`   | Logout & clear cookie      |

### 🔹 **Task CRUD Operations**

| Method   | Endpoint     | Description                             |
| -------- | ------------ | --------------------------------------- |
| `POST`   | `/tasks/`    | Create a task                           |
| `GET`    | `/tasks/`    | Get tasks (with pagination & filtering) |
| `GET`    | `/tasks/:id` | Get a single task by ID                 |
| `PUT`    | `/tasks/:id` | Update a task                           |
| `DELETE` | `/tasks/:id` | Delete a task                           |

### 🔹 **Task Scheduling**

| Method | Endpoint          | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| `GET`  | `/tasks/schedule` | Get tasks sorted by priority & timestamp |

---

## 📌 Request & Response Examples

### **1️⃣ Register a User**

**Request:**

```sh
curl -X POST http://localhost:5000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
           "username": "JohnDoe",
           "email": "johndoe@example.com",
           "password": "securePassword123"
         }'
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

---

### **2️⃣ Login & Get JWT Token**

**Request:**

```sh
curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "johndoe@example.com",
           "password": "securePassword123"
         }'
```

**Response:**

```json
{
  "token": "your_jwt_token"
}
```

---

### **3️⃣ Create a Task**

**Request:**

```sh
curl -X POST http://localhost:5000/tasks/ \
     -H "Content-Type: application/json" \
     -H "Cookie: auth_token=<YOUR_JWT_TOKEN>" \
     -d '{
           "title": "Complete Project",
           "description": "Finish the MERN Stack Project",
           "status": "pending",
           "priority": "high"
         }'
```

**Response:**

```json
{
  "_id": "660b1a2df9b3e69a8d4d23a1",
  "title": "Complete Project",
  "description": "Finish the MERN Stack Project",
  "status": "pending",
  "priority": "high",
  "userId": "65fb2a9e8d1c3b12cfd8aabc",
  "createdAt": "2025-03-18T18:00:00.000Z"
}
```

---

## 📌 Project Structure

```
📂 task-management-api
 ┣ 📂 config
 ┃ ┣ 📜 db.js              # MongoDB connection
 ┣ 📂 models
 ┃ ┣ 📜 User.js            # User Schema
 ┃ ┣ 📜 Task.js            # Task Schema
 ┣ 📂 middlewares
 ┃ ┣ 📜 auth.js            # Authentication middleware
 ┣ 📂 routes
 ┃ ┣ 📜 authRoutes.js      # Auth endpoints
 ┃ ┣ 📜 taskRoutes.js      # Task endpoints
 ┣ 📂 utils
 ┃ ┣ 📜 taskScheduler.js   # Min-Heap based task sorting
 ┣ 📜 .env                 # Environment variables
 ┣ 📜 package.json         # Dependencies & scripts
 ┣ 📜 README.md            # API Documentation
 ┣ 📜 server.js            # Entry point
```

---

## 📌 Testing (Jest + Supertest)

### **1️⃣ Install Test Dependencies**

```sh
npm install --save-dev jest supertest
```

### **2️⃣ Example Test (`tests/task.test.js`)**

```javascript
const request = require("supertest");
const app = require("../server"); // Adjust path based on setup

describe("Task API Tests", () => {
  let token = "<YOUR_JWT_TOKEN>";

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks/")
      .set("Cookie", `auth_token=${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task",
        status: "pending",
        priority: "low",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Task");
  });
});
```

### **3️⃣ Run Tests**

```sh
npm test
```

---

## 📌 Future Enhancements

- ✅ **Task deadline support**
- ✅ **Task comments & attachments**
- ✅ **User roles & permissions (Admin, User, etc.)**
- ✅ **Docker support for deployment**

---

## 📌 License

This project is licensed under the **MIT License**.

---

## 📌 Contributors

👨‍💻 **Aravind Ganteda**  
💬 **Feel free to contribute or raise issues!**

---

### 🚀 **Task Management API is now ready for production!** 🔥

Let me know if you need any changes! 🚀✨

```

---

### **📌 Why is this README great?**
✅ **Clear setup instructions**
✅ **Detailed API documentation with examples**
✅ **Project structure for easy navigation**
✅ **Testing instructions**
✅ **Future enhancements for scalability**

🔥 **This is a professional, production-ready README.** Let me know if you need modifications! 🚀
```

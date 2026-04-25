# CampusHub Enterprise OS

A sophisticated, unified campus orchestration platform.

## 🚀 How to Run the Code

Follow these instructions to set up the Smart Campus Hub locally on your machine.

### Prerequisites

*   **Java 17 or higher** 
*   **Node.js 20.x or higher**
*   **Maven** (if not using the included wrapper)
*   **MongoDB Atlas Account** (or a local MongoDB instance)


### Step 2: Launch the Backend

The backend is built with Spring Boot. Navigate to the `backend` directory (if not already there) and run:

```bash
cd backend
mvn spring-boot:run
```
The server will start on `http://localhost:8081`.

---

### Step 3: Launch the Frontend

The frontend is built with React and Vite. Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```
---


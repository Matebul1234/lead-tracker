import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import connection from "./models/db.js"; // should be a mysql2/promise pool
import userRouter from "./Routers/user.router.js";
import leadRouter from "./Routers/lead.router.js";

import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

// Middleware
app.use(bodyParser.json());

// ✅ CORS setup
const allowedOrigins = [
  'https://leadtracker.in',     // ✅ Frontend
  'http://localhost:3002',       // ✅ Local testing
  'http://192.168.2.57:3002'
];

app.use(cors({
  origin: allowedOrigins, // explicit origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/lead", leadRouter);
app.get("/demo", (req, res) => {
  res.send("from backend side");
});

// ✅ Port setup
const PORT = process.env.PORT || 5000;

// ✅ Check DB connection before starting server
async function startServer() {
  try {
    const conn = await connection.getConnection(); 
    console.log("✅ Database connected successfully");
    conn.release(); // release back to pool

    app.listen(PORT, () => {
      console.log(`🚀 Server running on Port: ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message || err);
    process.exit(1); // stop the app
  }
}

startServer();



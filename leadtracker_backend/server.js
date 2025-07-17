import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import pool from "./models/db.js"; // renamed to pool for clarity
import userRouter from "./Routers/user.router.js";
import leadRouter from "./Routers/lead.router.js";

const app = express();

// Middleware
app.use(bodyParser.json());

const allowedOrigins = ['http://192.168.2.57:3002', 'http://10.1.1.27:3002', 'https://leadtracker.in'];
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// ✅ Check database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // simple ping to test connection
    console.log(' Database Connected');
    connection.release(); // release back to pool
  } catch (error) {
    console.error(' Error connecting to database:', error);
  }
})();

// Routers
app.use("/api/user", userRouter);
app.use("/api/lead", leadRouter);

app.get("/demo", (req, res) => {
  res.send("from backend side ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
  if (error) {
    console.log("Server failed to start");
  } else {
    console.log("Server running on Port:", PORT);
  }
});

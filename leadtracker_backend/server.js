
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import connection from "./models/db.js";
import userRouter from "./Routers/user.router.js";
import leadRouter from "./Routers/lead.router.js";

const app = express();

// Middleware
app.use(bodyParser.json());
// cors error handles
const allowedOrigins = ['http://192.168.2.57:3002','http://10.1.1.27:3002','https://leadtracker.in'];

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



//Router 
app.use("/api/user",userRouter);
app.get("/demo",(req,res)=>{
    res.send("from backend side ");
})
// Routes
// app.use('/auth', authRouter);
// app.use('/notes', noteRouter);

// Lead Router
app.use("/api/lead", leadRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, (error) => {
    if(error){
        console.log("error in connection")
    }
    console.log("Server running on the Port:", PORT);
});

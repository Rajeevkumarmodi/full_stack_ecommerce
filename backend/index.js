import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/dbConnection.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// database connection call
dbConnect();

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Server is Started");
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

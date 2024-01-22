import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/dbConnection.js";
dotenv.config();

const app = express();

// database connection call
dbConnect();

app.get("/", (req, res) => {
  res.send("Server is Started");
});

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

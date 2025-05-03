const express = require("express");
require("dotenv").config();
const cors = require("cors");

//connection with mongodb database;
const { connection } = require("./config/db");
//routes
const { userRouter } = require("./routes/userRoutes");
const { userLibraryRouter } = require("./routes/userLibraryRouter");
const { awsRouter } = require("./routes/awsRoutes");
const { authMiddleware } = require("./middlewares/authMiddleware");

const app = express();

app.use(
  cors({
    origin: `https://document-highlighter-xott.vercel.app`,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", authMiddleware, (req, res) => {
  res.json({ message: "working" });
});

//routes
app.use("/api/user", userRouter);
app.use("/api/library", userLibraryRouter);
app.use("/api", awsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";
  res.status(statusCode).json({
    status: statusCode,
    msg: message,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log("server started at http://localhost:8080...");
  try {
    await connection;
    console.log("connected to database");
  } catch (err) {
    console.log(err);
    console.log("Not connected to database");
  }
});

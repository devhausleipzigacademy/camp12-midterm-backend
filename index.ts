import express from "express";
import { helloRouter } from "./routes/hello";
import { usersRouter } from "./routes/users";

// Initialize application
const app = express();

// Define an endpoint
app.use("/hello", helloRouter);
app.use("/users", usersRouter);

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

import express from "express";
import { helloRouter } from "./routes/hello";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/registration";
import {bookmarkRouter} from "./routes/bookmark"

// Initialize application
const app = express();

app.use(express.json());

// Define an endpoint
app.use("/hello", helloRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter)
app.use("/bookmarks", bookmarkRouter)

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

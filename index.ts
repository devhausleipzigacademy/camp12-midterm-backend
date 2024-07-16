import express from "express";
import { helloRouter } from "./routes/hello";
import { usersRouter } from "./routes/users";
import { loginRouter } from "./routes/login";
import { bookmarksRouter } from "./routes/bookmarks";
import { reservationsRouter } from "./routes/reservations"; // Import the reservations router

// Initialize application
const app = express();

app.use(express.json());

// Define an endpoint
app.use("/hello", helloRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/reservations", reservationsRouter); // Use the reservations router

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

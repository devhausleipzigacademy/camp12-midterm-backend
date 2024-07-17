import express from "express";
import { helloRouter } from "./routes/hello";
import { usersRouter } from "./routes/users";
import { bookmarkRouter } from "./routes/bookmark";
import { customisationRouter } from "./routes/cust-profile";
import { registrationRouter } from "./routes/registration";
import { loginRouter } from "./routes/login";
import { reservationsRouter } from "./routes/reservations";
import { timesRouter } from "./routes/times";
import { sql } from "./lib/db";

// Initialize application
const app = express();

app.use(express.json());

// Define an endpoint
app.use("/hello", helloRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/times", timesRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/profile", customisationRouter);
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);
app.use("/reservations", reservationsRouter);

app.get("/setup", async (_, res) => {
  console.log("Clean database");
  await sql`DROP TABLE IF EXISTS bookmarks;`;
  await sql`DROP TABLE IF EXISTS screenings;`;
  await sql`DROP TABLE IF EXISTS users;`;
  await sql`DROP TABLE IF EXISTS reservations;`;

  console.log("🧩 Creating users table...");
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar_image VARCHAR(255)
    );
  `;
  console.log("😃 Seeding users...");
  await sql`DELETE FROM users;`;
  await sql`
    INSERT INTO users
    (email, first_name, last_name, password)
    VALUES
    ('john@doe.com', 'John', 'Doe', 'password123'),
    ('bob@doe.com', 'Bob', 'Doe', 'password456'),
    ('jane@doe.com', 'Jane', 'Doe', 'password789');
  `;

  console.log("Creating bookmarks table...");
  await sql`
  CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR(255) NOT NULL,
    user_id INT
  );
`;
  await sql`ALTER TABLE bookmarks ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);`;

  console.log("Seeding bookmarks...");
  await sql`DELETE FROM bookmarks;`;
  await sql`
    INSERT INTO bookmarks
    (movie_id, user_id)
    VALUES
    ('1022789', 1),
    ('1010581', 1),
    ('519182', 2),
    ('935271', 3);`;

  console.log("Creating screenings table...");
  await sql`
    CREATE TABLE IF NOT EXISTS screenings (
      id SERIAL PRIMARY KEY,
      date VARCHAR(255) NOT NULL,
      time VARCHAR(255) NOT NULL,
      booked_seats VARCHAR(255),
      movie_id VARCHAR(255) NOT NULL
    );
  `;

  console.log("Seeding screenings...");
  await sql`DELETE FROM screenings;`;
  await sql`
    INSERT INTO screenings
    (date, time, booked_seats, movie_id)
    VALUES
    ('21/07/2024', '17:00', 'A1,A2,F3', '1022789'),
    ('17/07/2024', '12:00', 'C3,C4', '1010581');
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      user_id INT,
      screening_id INT
    );
  `;
  await sql`ALTER TABLE reservations ADD CONSTRAINT fk_user_reservation FOREIGN KEY (user_id) REFERENCES users(id);`;
  await sql`ALTER TABLE reservations ADD CONSTRAINT fk_screening_reservation FOREIGN KEY (screening_id) REFERENCES screenings(id);`;

  res.json({ message: "🌱 Successfully seeded" });
});

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

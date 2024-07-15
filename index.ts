import express from "express";

// Initialize application
const app = express();

// Define an endpoint
app.get("/hello", (req, res) => {
  console.log(req.url);
  res.json({ message: "Hello" });
});

app.get("/hello/:name", (req, res) => {
  const { name } = req.params;
  console.log(name);
  //   const name = req.params.name;
  res.json({ message: `Hello ${name}!!!!!` });
});

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});

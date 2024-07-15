import { Router } from "express";

export const helloRouter = Router();

helloRouter.get("/", (req, res) => {
  const { name } = req.query;
  console.log(req.query);
  res.json({ message: "Hello" + name ? ` ${name}` : "" });
});

helloRouter.get("/:name", (req, res) => {
  const { name } = req.params;
  console.log(name);
  //   const name = req.params.name;
  res.json({ message: `Hello ${name}!!!!!` });
});

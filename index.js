import { Worker } from "worker_threads";
import express from "express";

const port = 3000;
const app = express();

app.get("/heavy", (req, res) => {
  let total = 0;
  for (let i = 0; i < 50_000_000; i++) {
    total++;
  }
  res.send(`The result of the CPU intesive task is ${total}\n`);
});

app.get("/non-blocking", (req, res) => {
  res.send(`This is non-blocking`);
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (total) => {
    res.send(`The result of the CPU intesive task is ${total}\n`);
  });

  worker.on("error", (err) => {
    res.status(404).send(`An error occured`, err.message);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`worker pid=${process.pid}`);
});

import { Worker } from "worker_threads";
import express from "express";

const port = 3000;
const app = express();
const THREAD_COUNTS = 4;

const createWorker = () =>
  new Promise((resolve, reject) => {
    const worker = new Worker("./four-workers.js", {
      workerData: { THREAD_COUNTS },
    });

    worker.on("message", (total) => {
      resolve(total);
    });

    worker.on("error", (err) => {
      reject(err);
    });
  });

app.get("/non-blocking", (req, res) => {
  res.send(`This is non-blocking`);
});

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNTS; i++) {
    workerPromises.push(createWorker());
  }
  try {
    const threadResults = await Promise.all(workerPromises);
    const total = threadResults.reduce((acc, curr) => acc + curr, 0);
    res.send(`The result of the CPU intesive task is ${total}\n`);
  } catch (error) {
    res.status(404).send(`An error occured`, err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`worker pid=${process.pid}`);
});

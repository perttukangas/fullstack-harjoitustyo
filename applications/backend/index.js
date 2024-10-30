import express from 'express';
import { router } from "express-file-routing"

const app = express();

const PORT = 3003;

app.use("/", await router())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
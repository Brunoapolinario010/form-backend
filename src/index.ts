import express from "express";
import cors from "cors";

import userRouter from "./user/user.controller";

const app = express();
const port = 3200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
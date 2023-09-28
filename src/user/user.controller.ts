import express, { Request, Response } from "express";
import * as userServices from "./user.service";

const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => userServices.getUsers(req, res));

userRouter.get("/:id", (req: Request, res: Response) => userServices.getUser(req, res));

userRouter.post("/", (req: Request, res: Response) => userServices.createUser(req, res));

userRouter.put("/:id", (req: Request, res: Response) => userServices.updateUser(req, res));

userRouter.delete("/:id", (req: Request, res: Response) => userServices.deleteUser(req, res));

export default userRouter;
import { ZodError, z } from 'zod';
import { v4 as uuid} from 'uuid';
import { Request, Response } from 'express';

const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  gender: z.string()
});

const createUserSchema = UserSchema.omit({ id: true }).extend({
  confirmPassword: z.string().min(8).max(100),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept terms and conditions" })
});

const updateUserSchema = UserSchema.omit({ id: true }).partial();

type User = z.infer<typeof UserSchema>;

let users: User[] = [];

export async function getUsers(req: Request, res: Response) {

  return res.status(200).send(
    users.map(user => ({
       ...user, password: undefined
    }))
  );
};

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = users.find(user => user.id === id);
    if(!user) throw new ZodError([{
      code: "custom",
      path: ["id"],
      message: "User not found"
    }]);
  
    return res.status(200).send(
      users.map(user => ({
         ...user, password: undefined
      }))
    );
  } catch(error) {
    if(error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};

export async function createUser(req: Request, res: Response) {
  try {
    const validatedData = createUserSchema.safeParse(req.body);
  
    if(!validatedData.success) throw validatedData.error;
    if(validatedData.data.password !== validatedData.data.confirmPassword) throw new ZodError([{
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match"
    }]);

    const newUser = UserSchema.safeParse({ ...validatedData.data, id: uuid() });
    if(!newUser.success) throw newUser.error;
    if(users.find(user => user.email === newUser.data.email)) throw new ZodError([{
      code: "custom",
      path: ["email"],
      message: "Email already exists"
    }]);

    users.push(newUser.data);
    return res.status(201).send({ ...newUser.data, password: undefined });
  } catch (error) {
    if(error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.safeParse(req.body);
  
    if(!validatedData.success) return res.status(400).send(validatedData.error);
    
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex === -1) throw new ZodError([{
      code: "custom",
      path: ["id"],
      message: "User not found"
    }]);
  
    users[userIndex] = { ...users[userIndex], ...validatedData.data };
    return res.status(200).send({ ...users[userIndex], password: undefined });  
  } catch (error) {
    if(error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex === -1) throw new ZodError([{
      code: "custom",
      path: ["id"],
      message: "User not found"
    }]);
  
    users.splice(userIndex, 1);
    return res.status(204).send();  
  } catch (error) {
    if(error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};
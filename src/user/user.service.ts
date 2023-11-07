import { ZodError, z } from 'zod';
import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';


const prisma = new PrismaClient();
const saltRounds = 10;

const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  gender: z.string()
});

const createUserSchema = UserSchema.omit({ id: true }).extend({
  confirmPassword: z.string().min(8).max(100),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept terms and conditions." })
});

const updateUserSchema = UserSchema.omit({ id: true }).partial();

type User = z.infer<typeof UserSchema>;


export async function getUsers(req: Request, res: Response) {
  try {
    const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (page < 1) throw new ZodError([{
      code: "custom",
      path: ["page"],
      message: "Page cannot be less than 1."
    }]);

    if (limit < 1) throw new ZodError([{
      code: "custom",
      path: ["limit"],
      message: "Limit cannot be less than 1."
    }]);
    
    const offset: number = (page - 1) * limit;

    const users = await prisma
      .user
      .findMany({
        skip: offset,
        take: limit,
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    if (users.length <= 0) throw new ZodError([{
      code: "custom",
      path: ["id"],
      message: "Cannot find any users."
    }]);

    return res.status(200).send(
      users.map(user => ({
        ...user, password: undefined
      }))
    );
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) return res.status(400).send(e.issues);
  }
};

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new ZodError([{
        code: "custom",
        path: ["id"],
        message: "User not found."
      }])
    };

    return res.status(200).send({ ...user, password: undefined });
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.issues);
  }
};

export async function createUser(req: Request, res: Response) {
  try {
    const validatedData = createUserSchema.safeParse(req.body);

    if (!validatedData.success) throw validatedData.error;
    if (validatedData.data.password !== validatedData.data.confirmPassword) throw new ZodError([{
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match"
    }]);

    const newUser = UserSchema.safeParse({ ...validatedData.data, id: uuid() });
    if (!newUser.success) throw newUser.error;

    if (await prisma.user.findUnique({
      where: {
        email: newUser.data.email
      }
    })) {
      throw new ZodError([{
        code: "custom",
        path: ["email"],
        message: "Email already exists"
      }]);
    }

    prisma
      .user
      .create({
        data: {
          ...newUser.data,
          password: await hash(newUser.data.password, saltRounds)
        }
      }).then(async (user) => {
        return res.status(201).send({ ...user, password: undefined });
      }
      ).catch(async (e) => {
        console.error(e);
      }
      ).finally(async () => {
        prisma.$disconnect();
      });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.safeParse(req.body);

    if (!validatedData.success) return res.status(400).send(validatedData.error);

    const user = await prisma
      .user
      .update({
        where: {
          id: id
        },
        data: validatedData.data
      })
      .catch(async (e) => {
        console.error(e);
      });

    return res.status(200).send({ ...user, password: undefined });
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    prisma
      .user
      .delete({
        where: {
          id: id
        }
      })
      .catch(async (e) => {
        console.error(e);
      });
    return res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) return res.status(400).send(error.issues);
    return error;
  }
};
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface CreateUser {
  firstName: string;
  lastName: string;
  passwordHash: string;
  email: string;
}

const userSelector: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
};

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelector,
      },
    }),

  // with password
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  create: (user: CreateUser) =>
    prisma.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
      },
      select: {
        ...userSelector,
      },
    }),
};

/* export const questionRepository = {
  async safeCreate(data: Prisma.QuestionCreateInput) {
    try {
      return await prisma.question.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        if (error.code === 'P2002') {
          throw new Error('Question already exists')
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new Error('Related chapter not found')
        }
      }
      throw error
    }
  } */

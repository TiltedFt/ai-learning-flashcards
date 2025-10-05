import { prisma } from '@/lib/db'


export const userRepository = {
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  create: (data: any) => prisma.user.create({ data }),

 /*  createTrx: async (data: any) => {
    return await prisma.$transaction(async (tx) => {
        // tx transactions hereee
    })
  }, */
}


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
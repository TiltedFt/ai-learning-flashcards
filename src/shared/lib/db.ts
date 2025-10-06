import { PrismaClient, Prisma } from '@prisma/client'
import { ValidationError, NotFoundError, ConflictError } from './errors'

// Error mapping :)
const prismaErrorHandlers:  Record <string, (error: Prisma.PrismaClientKnownRequestError) => Error> = {
  P2002: (error) => {
    const field = (error.meta?.target as string[])?.[0] || 'Field'
    return new ConflictError(`${field} already exists`)
  },
  P2025: () => new NotFoundError('Record not found'),
  P2003: () => new ValidationError('Invalid reference'),
  P2023: () => new ValidationError('Invalid ID format'),
  P2024: () => new ValidationError('Connection timed out'),
}

const prismaClientSingleton = () => {
  const baseClient = new PrismaClient()

  const client = baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            return await query(args)
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              const handler = prismaErrorHandlers[error.code]
              if (handler) {
                throw handler(error)
              }
            }
            throw error
          }
        },
      },
    },
  })

  return client
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
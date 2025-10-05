/* import { withErrorHandler } from '@/lib/api-handler'
import { userRepository } from '@/lib/queries/user.repo'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = withErrorHandler(async (
  req: NextRequest, 
  { params }: { params: { id: string } }
) => {
  const { email } = await req.json()
  
  // Вызываем репозиторий
  const user = await userRepository.update(params.id, { email })
  
  return NextResponse.json({ user })
}) */

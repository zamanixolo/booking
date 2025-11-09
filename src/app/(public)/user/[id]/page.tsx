// src/app/(public)/user/[id]/page.tsx
import Menu from '@/app/components/(public)/User/Menu'
import UserDash from '@/app/components/(public)/User/UserDash'
import { getProviderByClerkId } from '@/app/libs/providers/providers'
import { getUserByClerkId } from '@/app/libs/users/user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

// ✅ In Next.js 15, params is a Promise
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params  // <-- await the params
  const user = await currentUser()

  if (!user) redirect('/user')

  const dbUser = await getUserByClerkId(id)
  const dbProvider = await getProviderByClerkId(id)

  if (!dbUser && !dbProvider) redirect('/user')
  if (dbProvider) redirect('/admin')

  return (
    <div>
      <UserDash id={id} />
    </div>
  )
}


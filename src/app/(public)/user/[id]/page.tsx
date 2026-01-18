
// Keep this set to 'nodejs' to satisfy the Clerk import:
export const runtime = 'nodejs';

import UserDash from '@/app/components/(public)/User/UserDash'
import { getProviderByClerkId } from '@/app/libs/providers/providers'
import { getUserByClerkId } from '@/app/libs/users/user'
import React from 'react'
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server'; // App router equivalent

// We must bypass the strict TS checks because Next.js expects params to be a Promise during build time analysis
// @ts-expect-error
export default async function UserProfilePage({ params }) {
 
  const { id } =await params; 


  const user = await currentUser();

// console.log(id)
  // // ✅ If no Clerk user is signed in → redirect to /user
  if (!user) {
    console.error('--- REDIRECTING DUE TO NO CLERK USER'); // <-- This log should appear if this runs
    redirect('/user');
  }

  // // // Fetch from Prisma 
  const dbUser = await getUserByClerkId(id);

  // console.log("--- DB User result:", dbUser); // <-- Check this log
  const dbProvider = await getProviderByClerkId(id);
  // console.log("--- DB Provider Result:", dbProvider); // <-- Check this log

  // ✅ Not found → redirect to a general user page (assuming this is correct logic)
  if (!dbUser && !dbProvider) {
    console.error('--- REDIRECTING DUE TO USER/PROVIDER NOT FOUND IN DB');
    redirect('/');
  }

  // // ✅ If provider → redirect to admin dashboard
  if (dbProvider) {
    console.log('--- REDIRECTING TO ADMIN DASHBOARD (IS A PROVIDER)');
    redirect('/admin');
  }

  // console.log('--- RENDERING USER DASHBOARD'); // <-- This log should appear if the page loads

  return (
    <div>

      <UserDash
      id={id}
      />
        <p>Page Loaded: User ID {id}, Clerk Status: {user ? 'Logged In' : 'Logged Out'}</p>
    </div>
  )
}

import { Inter } from 'next/font/google';
import '../globals.css';
import { ReactNode } from "react";
import Nav from '../components/admin/nav/Nav';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getProviderByClerkId } from '@/app/libs/providers/providers';
import { getUserByClerkId } from '@/app/libs/users/user';

const inter = Inter({ subsets: ['latin'] });

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // ✅ Get current Clerk user (server-side)
  // const user = await currentUser();

  // 1️⃣ Not signed in → redirect to /user (sign in)
  // if (!user) redirect('/user');

  // 2️⃣ Try to find provider and user in DB
  // const clerkId = user.id;
  // const provider = await getProviderByClerkId(clerkId);
  // const dbUser = await getUserByClerkId(clerkId);

  // 3️⃣ If not a provider → redirect to /user/:id or /user
  // if (!provider) {
  //   if (dbUser) redirect(`/user/${dbUser.id}`);
  //   redirect('/user');
  // }

  // 4️⃣ Allow access to admin routes if provider exists
  return (
    <div className={inter.className}>
      <Nav />
      {children}
    </div>
  );
}

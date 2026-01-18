import { Inter } from 'next/font/google';
import '../globals.css';
import { ReactNode } from "react";
import Nav from '../components/(public)/Nav/Nav';
import Footer from '../components/(public)/Footer/Footer';
const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
    <Nav/>
    <main className='min-h-[85vh]'>
      {children}
    </main>
    <Footer/>
    </div>
  );
}

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = true;

  if (!currentUser) return redirect('/sign-in');

  return (
    <main className="flex h-full w-full">
      <Sidebar />
      <section className="flex w-full h-full flex-1 flex-col">
        <Header />
        {children}
      </section>
    </main>
  );
};

export default Layout;

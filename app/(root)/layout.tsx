import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = true;

  if (!currentUser) return redirect('/sign-in');

  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;

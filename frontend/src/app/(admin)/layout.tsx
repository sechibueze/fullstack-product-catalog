'use client';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className='flex min-h-screen bg-bg-secondary'>
        <AdminSidebar />
        <div className='flex flex-1 flex-col min-w-0'>
          <AdminHeader />
          <main className='flex-1 p-4 md:p-6 lg:p-8'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

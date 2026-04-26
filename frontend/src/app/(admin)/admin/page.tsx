'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /admin to /admin/products
export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);

  return null;
}

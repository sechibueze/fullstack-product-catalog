'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
    exact: false,
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    icon: MessageSquare,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      aria-label='Admin navigation'
      className={cn(
        'hidden md:flex flex-col',
        'w-60 min-h-screen',
        'bg-surface border-r border-border',
        'sticky top-0 h-screen overflow-y-auto',
      )}
    >
      {/*  Logo  */}
      <div className='flex h-16 items-center gap-2 px-6 border-b border-border'>
        <ShoppingBag className='h-5 w-5 text-primary' aria-hidden='true' />
        <span className='font-bold text-text-primary'>Admin Panel</span>
      </div>

      {/* Nav links  */}
      <nav className='flex-1 px-3 py-4'>
        <ul role='list' className='space-y-1'>
          {ADMIN_LINKS.map((link) => {
            const active = isActive(link.href, link.exact);
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md',
                    'text-sm font-medium',
                    'transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-primary',
                    active
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
                  )}
                >
                  <Icon className='h-4 w-4 shrink-0' aria-hidden='true' />
                  <span className='flex-1'>{link.label}</span>
                  {active && (
                    <ChevronRight className='h-3 w-3' aria-hidden='true' />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to site  */}
      <div className='p-3 border-t border-border'>
        <Link
          href='/'
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'text-xs text-text-tertiary',
            'hover:text-text-primary hover:bg-bg-secondary',
            'transition-colors duration-fast',
          )}
        >
          <ShoppingBag className='h-3.5 w-3.5' aria-hidden='true' />
          View store
        </Link>
      </div>
    </aside>
  );
}

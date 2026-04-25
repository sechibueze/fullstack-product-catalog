'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      role='banner'
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] w-full',
        'bg-surface/95 backdrop-blur-sm',
        'border-b border-border',
        'transition-shadow duration-normal',
        isScrolled && 'shadow-md',
      )}
    >
      <nav
        aria-label='Main navigation'
        className='container-app flex h-16 items-center justify-between'
      >
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-2 font-bold text-xl text-primary'
          aria-label='Product Catalog home'
        >
          <ShoppingBag className='h-6 w-6' aria-hidden='true' />
          <span>ProductCatalog</span>
        </Link>

        {/* Desktop nav  */}
        <ul role='list' className='hidden md:flex items-center gap-1'>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium',
                  'transition-colors duration-fast',
                  'hover:bg-bg-secondary hover:text-primary',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary',
                  pathname === link.href
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary',
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions  */}
        <div className='flex items-center gap-2'>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'p-2 rounded-md',
              'text-text-secondary hover:text-primary',
              'hover:bg-bg-secondary',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary',
            )}
          >
            {isDark ? (
              <Sun className='h-5 w-5' aria-hidden='true' />
            ) : (
              <Moon className='h-5 w-5' aria-hidden='true' />
            )}
          </button>

          {/* Hamburger menu for mobile only */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
            className={cn(
              'md:hidden p-2 rounded-md',
              'text-text-secondary hover:text-primary',
              'hover:bg-bg-secondary',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary',
            )}
          >
            {isOpen ? (
              <X className='h-5 w-5' aria-hidden='true' />
            ) : (
              <Menu className='h-5 w-5' aria-hidden='true' />
            )}
          </button>
        </div>
      </nav>

      {/*  Mobile menu  */}
      <div
        id='mobile-menu'
        role='dialog'
        aria-label='Mobile navigation'
        aria-modal='true'
        className={cn(
          'md:hidden fixed inset-0 top-16 z-[var(--z-modal)]',
          'bg-surface',
          'transition-all duration-normal',
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-2',
        )}
      >
        <ul role='list' className='container-app flex flex-col gap-1 pt-4'>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-md',
                  'text-base font-medium',
                  'transition-colors duration-fast',
                  pathname === link.href
                    ? 'text-primary bg-primary-light'
                    : 'text-text-primary hover:bg-bg-secondary hover:text-primary',
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

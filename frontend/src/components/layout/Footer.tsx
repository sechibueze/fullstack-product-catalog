import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

const FOOTER_LINKS = {
  Shop: [
    { href: '/products', label: 'All Products' },
    { href: '/categories', label: 'Categories' },
  ],
  Company: [{ href: '/', label: 'Home' }],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role='contentinfo'
      className='border-t border-border bg-bg-secondary'
    >
      <div className='container-app py-12'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand  */}
          <div className='col-span-1 sm:col-span-2 lg:col-span-2'>
            <Link
              href='/'
              className='flex items-center gap-2 font-bold text-lg text-primary'
              aria-label='Product Catalog home'
            >
              <ShoppingBag className='h-5 w-5' aria-hidden='true' />
              <span>ProductCatalog</span>
            </Link>
            <p className='mt-3 text-sm text-text-secondary max-w-xs leading-relaxed'>
              Discover our curated collection of quality products. Honest
              reviews, competitive prices.
            </p>
          </div>

          {/*  Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className='text-sm font-semibold text-text-primary mb-3'>
                {group}
              </h3>
              <ul role='list' className='space-y-2'>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-sm text-text-secondary hover:text-primary transition-colors duration-fast'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar  */}
        <div className='mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-text-tertiary'>
            &copy; {year} ProductCatalog. All rights reserved.
          </p>
          <p className='text-xs text-text-tertiary'>
            Made with ❤️ by Samuel Chibueze
          </p>
        </div>
      </div>
    </footer>
  );
}

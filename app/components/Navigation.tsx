'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '主页' },
    { href: '/team', label: '团队' },
    { href: '/research', label: '研究' },
    { href: '/teambuilding', label: '团建' },
    { href: '/contact', label: '联系我们' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/igamelogo-blue.png"
                alt="iGame Lab Logo"
                width={320}
                height={320}
                className="rounded"
              />
              <div>
                {/* <h1 className="text-sm font-medium text-gray-900">iGame Lab</h1> */}
                {/* <p className="text-xs text-gray-600">智能可视化与仿真实验室</p> */}
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* HDU Logo */}
          <div className="flex items-center">
            <div className="text-right">
              <Image
                src="/images/hdu-logo.png"
                alt="HDU Logo"
                width={160}
                height={160}
                className="rounded"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="bg-gray-200 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

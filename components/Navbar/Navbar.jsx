'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import menuItems from '../../ui-data/navbar.json';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { DarkModeToggle } from '../ui/darkmode-toggle';
import { MobileNavbar } from './MobileNavbar';

function Navbar() {
  const theme = useTheme();
  console.log(theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className='px-2 flex'>
      <div
        id='logo'
        className='pr-4 font-semibold text-3xl w-full md:w-1/12 p-2'
      >
        <Link href='/'>
          <Image
            src={theme.resolvedTheme ? '/images/DocuFlow-logo-'+theme.resolvedTheme+'.png' : '#'}
            height={512}
            width={512}
            alt='DocuFlow Logo'
            className='transition-all duration-300 hover:scale-125'
          />
        </Link>
      </div>
      <div id='menu' className='md:flex-grow flex'>
        <div className='md:flex hidden'>
          <ul className='md:flex py-2'>
            {menuItems.map((item, id) => (
              <li key={id} className='px-4 font-medium'>
                <Link href={item.href} target={item.newTab ? '_blank' : ''}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='m-1'>
          <DarkModeToggle />
        </div>
        <div className='md:hidden flex'>
          <MobileNavbar menuItems={menuItems} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

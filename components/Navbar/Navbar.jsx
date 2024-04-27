'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import menuItems from '../../ui-data/navbar.json';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { DarkModeToggle } from '../ui/darkmode-toggle';
import { MobileNavbar } from './MobileNavbar';
import Loading from '../Loading/Loading';
import { Skeleton } from '../ui/skeleton';

function Navbar() {
  const theme = useTheme();
  const [logo, setLogo] = useState(undefined);
    


  useEffect(() => {
    setLogo(theme.resolvedTheme)
  },[theme])
  


  return (
    <nav className='px-2 flex bg-card w-screen'>
      <div id='logo' className='py-3 px-2 font-semibold h-a10'>
        <Link href='/'>
          {!logo ? (
            <Skeleton className='w-[100px] h-[30px] rounded' />
          ) : (
            <Image
              src={
                theme.resolvedTheme && '/images/DocuFlow-logo-' + logo + '.png'
              }
              height={120}
              width={120}
              alt='DocuFlow Logo'
              className='transition-all duration-300'
            />
          )}
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
      </div>
      <div className='flex w-fit ml-auto mr-1'>
        <div className='m-1'>
          <DarkModeToggle />
        </div>
        <div className='md:hidden'>
          <MobileNavbar menuItems={menuItems} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

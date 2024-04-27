'use client'
import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { AuthUtil } from '@/app/view/auth/Utils/AuthUtil';
import { useAuth } from '@/app/view/auth/Hooks/useAuth';
import Loading from '../Loading/Loading';

function HeroSection() {

  const auth = useAuth('#','view/auth/');

  const signout = ()=>{
    AuthUtil.signout().then(()=>{
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
    });
  }

  if (auth.isLoading) return (
    <div class='flex justify-center items-center h-screen'>
      <Loading />
    </div>
  );

  return (
    <div className='h-screen w-100 px-4 py-16 flex flex-col md:flex-row flex-wrap align-middle md:justify-start'>
      <div className='mx-auto order-1 md:order-2 my-4 w-1/3'>
        <Image
          src='/images/app.png'
          alt='hero-image'
          height={1080}
          width={1080}
          className='w-auto'
        />
      </div>
      <div className='md:my-24 mx-auto md:w-1/3 justify-center md:order-1 order-2 text-center md:text-start'>
        <h2 className=' font-bold text-4xl md:text-6xl '>DocuFlow__</h2>
        <p className='mb-8 mt-4  text-2xl tracking-wide'>
          Build with Amaze and Power....
        </p>
        <Button asChild>
          <Link href='/view/build' className='mr-2'>
            Build
          </Link>
        </Button>
        <Button asChild>
          <Link href='/view/explorer' className='mr-2'>
            Explorer
          </Link>
        </Button>
        <Button variant='outline' onClick={signout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default HeroSection
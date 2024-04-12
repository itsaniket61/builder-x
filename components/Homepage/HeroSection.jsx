'use client'
import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import { AuthUtil } from '@/app/view/auth/Utils/AuthUtil';
import { useAuth } from '@/app/view/auth/Hooks/useAuth';

function HeroSection() {

  useAuth('#','view/auth/');

  const signout = ()=>{
    AuthUtil.signout().then(()=>{
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
    });
  }

  return (
    <div className='h-screen w-100 px-4 py-16 bg-dolly-200 flex flex-col md:flex-row flex-wrap align-middle md:justify-start'>
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
        <h2 className=' font-bold text-8xl md:text-6xl '>BuildifyX__</h2>
        <p className='mb-8 mt-4  text-2xl tracking-wide'>
          Build with Amaze and Power....
        </p>
        <Link
          href="/view/build"
          className='text-white py-4 px-8 rounded-md bg-black hover:bg-dolly-600 
                uppercase font-semibold mr-2'
        >
          Build
        </Link>
        <button
          onClick={signout}
          className='text-white py-4 px-8 rounded-md bg-black hover:bg-dolly-600 
                uppercase font-semibold mr-2'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default HeroSection
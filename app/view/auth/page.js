'use client'
import { showToast } from '@/components/Toast/Toast';
import React, { useState } from 'react'
import { AuthUtil } from './Utils/AuthUtil';

function Auth() {
    const [isSignInSreen,setIsSignInScreen] = useState(true);
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const switchAuth = (e) => {
        e.preventDefault();
        setIsSignInScreen(!isSignInSreen);
        showToast("You are now signed in");
    }

    const signIn = async (e) => {
        e.preventDefault();
        const {email, password} = formData;
        AuthUtil.signIn(email,password).then(({token}) => {
            localStorage.setItem('token',token);
            window.location.reload();
        }).catch((err)=>{
            showToast(err.message,"error");
        });
    }

  return (
    <div className='bg-dolly-200 h-screen'>
      <div className='p-10'>
        <h1 className='my-4 text-4xl text-center font-bold'>BuildifyX</h1>
        <div className='container bg-white p-4 rounded-lg shadow-lg mx-auto'>
          <h1 className='text-3xl font-bold text-center'>Sign In</h1>
          <form className='mt-2' onSubmit={signIn}>
            {!isSignInSreen && <input
              type='text'
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              value={formData.name}
              className='form-control outline-dolly-700 text-xl w-full p-2 border rounded-lg border-black mb-2'
              placeholder='Name'
            />}
            <input
              type='email'
              onChange={(e)=>setFormData({...formData,email:e.target.value})}
              value={formData.email}
              className='form-control outline-dolly-700 text-xl w-full p-2 border rounded-lg border-black mb-2'
              placeholder='Email'
            />
            <input
              type='password'
              onChange={(e)=>setFormData({...formData,password:e.target.value})}
              value={formData.password}
              className='form-control outline-dolly-700 text-xl w-full p-2 border rounded-lg border-black mb-2'
              placeholder='Password'
            />
            <div className='w-full'>
              <button
                type='submit'
                className='text-white py-2 px-8 rounded-md bg-black hover:bg-dolly-600 
                uppercase font-semibold'
              >
                {isSignInSreen ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
          <button
            onClick={switchAuth}
            className='text-dolly-900 hover:text-dolly-700 mt-2'
          >
            {isSignInSreen
              ? 'Create New Account'
              : 'Already have a new account.'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth
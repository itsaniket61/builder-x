'use client'
import { showToast } from '@/components/Toast/Toast';
import React, { useEffect, useState } from 'react'
import { AuthUtil } from './Utils/AuthUtil';
import { useAuth } from './Hooks/useAuth';

function Auth() {
    const [isSignInScreen,setIsSignInScreen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useAuth('/', '/view/auth');
    
    const switchAuth = (e) => {
        e.preventDefault();
        setIsSignInScreen(!isSignInScreen);
    }

    const signIn = async ({email,password}) => {
        AuthUtil.signIn(email,password).then(({token}) => {
            window.location.reload();
        }).catch((err)=>{
            showToast(err.message,"error");
        });
    }

    const signUp = async ({name, email, password}) => {
      AuthUtil.signUp(name, email, password).then((res) => {
        if(res){
          window.location.reload();
        }
        throw new Error("Somewhere went wrong")
      }).catch((err)=>{
        console.log(err);
        showToast(err.message,"error");
      });
    }

    useEffect(() => {
      const submitForm = async () => {
        if (isLoading) {
          console.log(isLoading);
          console.log('Form is submitting...');
          if (isSignInScreen) {
            await signIn(formData);
          } else {
            await signUp(formData);
          }
          console.log('Form submitted successfully!');
          setIsLoading(false);
        }
      };
      submitForm();
    }, [isLoading, isSignInScreen, formData]);

  return (
    <div className='bg-dolly-200 h-screen'>
      <div className='p-10'>
        <h1 className='my-4 text-4xl text-center font-bold'>BuildifyX</h1>
        <div className='container bg-white p-4 rounded-lg shadow-lg mx-auto'>
          <h1 className='text-3xl font-bold text-center'>Sign In</h1>
          <form className='mt-2' onSubmit={(e)=>{
            e.preventDefault();
            setIsLoading(true);
          }}>
            {!isSignInScreen && <input
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
              {!isLoading? <button
                type='submit'
                className='text-white py-2 px-8 rounded-md bg-black hover:bg-dolly-600 
                uppercase font-semibold'
              >
                {isSignInScreen ? 'Sign In' : 'Sign Up'}
              </button>:<p>Loading...</p>}
            </div>
          </form>
          <button
            onClick={switchAuth}
            className='text-dolly-900 hover:text-dolly-700 mt-2'
          >
            {isSignInScreen
              ? 'Create New Account'
              : 'Already have a new account.'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth
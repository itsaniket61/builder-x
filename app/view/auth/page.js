'use client';
import { showToast } from '@/components/Toast/Toast';
import React, { useEffect, useState } from 'react';
import { AuthUtil } from './Utils/AuthUtil';
import { useAuth } from './Hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-context-menu';
import Loading from '@/components/Loading/Loading';

function Auth() {
  const [isSignInScreen, setIsSignInScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const auth = useAuth('/', '/view/auth');

  const switchAuth = (e) => {
    e.preventDefault();
    setIsSignInScreen(!isSignInScreen);
  };

  const signIn = async ({ email, password }) => {
    setIsLoading(true);
    AuthUtil.signIn(email, password)
      .then(({ token }) => {
        window.location.reload();
      })
      .catch((err) => {
        showToast(err.message, 'error', {
          position: 'top-center',
        });
      }).finally(() => setIsLoading(false));
  };

  const signUp = async ({ name, email, password }) => {
    setIsLoading(true);
    AuthUtil.signUp(name, email, password)
      .then((res) => {
        if (res) {
          window.location.reload();
        }
        throw new Error('Somewhere went wrong');
      })
      .catch((err) => {
        showToast(err.message, 'error', {
          position: 'top-center',
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const submitForm = async () => {
      if (isLoading) {
        if (isSignInScreen) {
          await signIn(formData);
        } else {
          await signUp(formData);
        }
      }
    };
    submitForm();
  }, [isLoading, isSignInScreen]);

  if (auth.isLoading) return (
    <div class='flex justify-center items-center h-screen'>
      <Loading />
    </div>
  );

  return (
    <div className='w-full mt-14'>
      <Card className='w-full max-w-sm mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>
            {isSignInScreen ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoading(true);
            }}
          >
            {!isSignInScreen && (
              <div className='grid gap-2'>
                <Label htmlFor='email'>Name</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Aniket Sharma'
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  value={formData.name}
                  required
                />
              </div>
            )}
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                value={formData.password}
                required
              />
            </div>
          </form>
        </CardContent>
        {isLoading ? (
          <div className='w-full'>
            <div className='w-min mx-auto'>
              <Loading />
            </div>
          </div>
        ) : (
          <CardFooter>
            <Button
              className='w-full mr-1'
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
              }}
            >
              {isSignInScreen ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button variant='outline' onClick={switchAuth}>
              {isSignInScreen
                ? 'Create New Account'
                : 'Already have a new account.'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default Auth;

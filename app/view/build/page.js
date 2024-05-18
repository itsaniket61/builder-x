'use client';
import React, { useEffect, useRef, useState } from 'react';
import { buildUtil } from './Utils/buildUtil';
import { processWithToast, showToast } from '@/components/Toast/Toast';
import { useAuth } from '../auth/Hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/navigation';

function Build() {
  const auth = useAuth('/view/build', '/view/auth');

  const router = useRouter();

  const [formData, setFormData] = useState({
    location: '',
    fileName: '',
    prompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  async function build() {
    setIsLoading(true);
      await buildUtil
        .buildWithAi({
          folderPath: formData.location,
          outputFileName: formData.fileName,
          prompt: formData.prompt,
        }).then(async ({response})=>{
          router.push('/view/editor?craftx='+response);
          setFormData({
            location: '',
            fileName: '',
            prompt: '',
          });
        })
        .finally(() => setIsLoading(false));
  };

  if(auth.isLoading) return (
    <div className='flex justify-center items-center h-screen'>
      <Loading />
    </div>
  );

  return (
    <div className='h-screen'>
      <div className='sm:p-10'>
        <div>
          <Card className='shadow-none border-none sm:shadow-lg sm:border'>
            <CardHeader>
              <CardTitle>DocuFlow</CardTitle>
              <CardDescription>Build Amazing with power of AI</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className='mt-2'
                onSubmit={(e) => {
                  e.preventDefault();
                  processWithToast(
                    {
                      startMessage: 'Building...',
                      successMessage: 'Built successfully',
                      failureMessage: 'Failed to build',
                    },
                    build()
                  );
                }}
              >
                <Input
                  className='my-2'
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                  }}
                  placeholder='Enter Collection Path........'
                />
                <Input
                  className='my-2'
                  value={formData.fileName}
                  onChange={(e) => {
                    setFormData({ ...formData, fileName: e.target.value });
                  }}
                  placeholder='File Name'
                />
                <Textarea
                  className='my-2 w-full'
                  value={formData.prompt}
                  onChange={(e) => {
                    setFormData({ ...formData, prompt: e.target.value });
                  }}
                  placeholder='Enter Promt for AI'
                />
                {isLoading ? (
                  <Loading/>
                ) : (
                  <Button type='submit'>Build</Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Build;

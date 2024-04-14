'use client';
import React, { useEffect, useRef, useState } from 'react';
import { buildUtil } from './Utils/buildUtil';
import { showToast } from '@/components/Toast/Toast';
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

function Build() {
  useAuth('/view/build', '/view/auth');

  const toastId = useRef(null);
  const notify = () => (toastId.current = toast('Building...', { autoClose: false }));
  const update = () =>
    toast.update(toastId.current, {
      autoClose: 100,
    });

  const [formData, setFormData] = useState({
    location: '',
    fileName: '',
    prompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function build() {
      if (isLoading) {
        notify();
        buildUtil
          .buildWithAi({
            folderPath: formData.location,
            outputFileName: formData.fileName,
            prompt: formData.prompt,
          })
          .then(() => {
            setIsLoading(false);
            showToast('Built successfully');
          })
          .catch((err) => {
            setIsLoading(false);
            showToast(err.message, 'error');
          });
      } else {
        setFormData({
          location: '',
          fileName: '',
          prompt: '',
        });
        update();
      }
    }
    build();
  }, [isLoading]);

  return (
    <div className='bg-dolly-200 h-screen'>
      <div className='p-10'>
        <div className='container'>
          <Card>
            <CardHeader>
              <CardTitle>BuildifyX</CardTitle>
              <CardDescription>Build Amazing with power of AI</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className='mt-2'
                onSubmit={(e) => {
                  setIsLoading(true);
                  e.preventDefault();
                }}
              >
                <Input
                  className='my-2'
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                  }}
                  placeholder='Location'
                />
                <Input
                  className='my-2'
                  onChange={(e) => {
                    setFormData({ ...formData, fileName: e.target.value });
                  }}
                  placeholder='File Name'
                />
                <Textarea
                  onChange={(e) => {
                    setFormData({ ...formData, prompt: e.target.value });
                  }}
                  className='my-2 w-full'
                  placeholder='Enter Promt for AI'
                ></Textarea>
                {isLoading ? (
                  <p>Loading..</p>
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

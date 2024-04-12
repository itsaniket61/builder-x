'use client'
import React, { useState } from 'react'
import { buildUtil } from './Utils/buildUtil';
import { showToast } from '@/components/Toast/Toast';

function Build() {
    const [formData,setFormData] = useState({location:'',fileName:'',prompt:''});
  return (
    <div className='bg-dolly-200 h-screen'>
      <div className='p-10'>
        <div className='container bg-white p-4 rounded-lg shadow-lg mx-auto'>
          <h1 className='text-3xl font-bold text-center'>BuildifyX</h1>
          <form
            className='mt-2'
            onSubmit={(e) => {
              e.preventDefault();
              buildUtil.buildWithAi({
                folderPath: formData.location,
                outputFileName: formData.fileName, 
                prompt: formData.prompt
            }).then(() => {
                showToast("Built successfully");
            }).catch((err) => {
                showToast(err.message, "error");
            });
            }}
          >
            <input
              className='form-control w-full my-2 outline-dolly-700 p-2'
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
              }}
              placeholder='Location'
            />
            <input
              className='form-control w-full my-2 outline-dolly-700 p-2'
              onChange={(e) => {
                setFormData({ ...formData, fileName: e.target.value });
              }}
              placeholder='File Name'
            />
            <textarea
              onChange={(e) => {
                setFormData({ ...formData, prompt: e.target.value });
              }}
              className='form-control w-full my-2 outline-dolly-700 p-2'
              placeholder='Enter Promt for AI'
            ></textarea>
            <button
              type='submit'
              className='text-white py-2 px-8 rounded-md bg-black hover:bg-dolly-600 
                uppercase font-semibold'
            >
              Build
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Build
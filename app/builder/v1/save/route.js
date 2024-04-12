import { saveController } from '@/controllers/saveController';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try{
    return await saveController(request);
  }catch(error){
    return NextResponse.json({error: error.message},{status: 500});
  }
};

import { buildPdfController } from '@/controllers/buildPdfController';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    return await buildPdfController(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

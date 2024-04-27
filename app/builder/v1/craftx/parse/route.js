import { parseCraftxController } from '@/controllers/parseCraftxController';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    return await parseCraftxController(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

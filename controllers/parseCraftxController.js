import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
import { CrafterUtil } from '@/utils/CrafterUtil';
import { NextResponse } from 'next/server';

export const parseCraftxController = async (request) => {
  try {
    
    let {craftxPath} = await request.json();
    const uid = await request.headers.get('userid');
    console.log(craftxPath);
    if (craftxPath) {
      console.log('Parsing ' + craftxPath);
      const craftxBlob = await CloudKeeperUtil.downloadFile(uid, craftxPath);
      const response = await CrafterUtil.parseCraftx(craftxBlob);
      return NextResponse.json(response, { status: 200 });
    }
    throw new Error('Failed to Parse');
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

import { AppConstants } from '@/Constants/AppConstants';

const { CloudKeeperUtil } = require('@/utils/CloudKeeperUtil');
const { NextResponse } = require('next/server');

export const GET = async (request) => {
  try {
    let uid = await request.headers.get('userid');
    if(!uid) throw new Error('Invalid userid');
    uid = AppConstants.TEMPLATES_ROOT_DIR_ALIAS;
    const folder = '';
    const files = await CloudKeeperUtil.listAllFiles(uid, folder);
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

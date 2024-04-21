const { CloudKeeperUtil } = require('@/utils/CloudKeeperUtil');
const { NextResponse } = require('next/server');

export const GET = async (request) => {
  try {
    const uid = await request.headers.get('userid');
    const filePath = request.nextUrl.searchParams.get('filePath');
    const downloadUrl = await CloudKeeperUtil.getDownloadUrl(uid, filePath);
    return NextResponse.json(downloadUrl, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (request) => {
  try {
    const uid = await request.headers.get('userid');
    const filePath = request.nextUrl.searchParams.get('filePath');
    const status = await CloudKeeperUtil.deleteFile(uid, filePath);
    if(status) return NextResponse.json("File Delted Successfully", { status: 200 });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const { CloudKeeperUtil } = require("@/utils/CloudKeeperUtil");
const { NextResponse } = require("next/server");

export const GET = async (request) => {
    try {
        const uid = await request.headers.get('userid');
        const folder = request.nextUrl.searchParams.get('folderPath');
        const files = await CloudKeeperUtil.listAllFiles(uid,folder);
        return NextResponse.json(files,{status:200});
    } catch (error) {
        return NextResponse.json({error: error.message},{status: 500});
    }
}
import { CloudKeeperUtil } from "@/utils/CloudKeeperUtil";
import { CrafterUtil } from "@/utils/CrafterUtil";
import { NextResponse } from "next/server";

export const buildPdfController = async (request)=>{
    try {
        const {craftxFilePath} = await request.json();
        const uid = await request.headers.get('uid');
        const fileame = craftxFilePath.split('/').at(-1).split('.').at(0);
        // Get file
        const craftxBlob = await CloudKeeperUtil.downloadFile(uid,craftxFilePath);
        const pdfBlob = await CrafterUtil.buildPdf(craftxBlob);
        return new NextResponse(pdfBlob.stream(), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf;filename=' + fileame + '.pdf',
          },
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
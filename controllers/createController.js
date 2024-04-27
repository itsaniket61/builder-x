import { CrafterUtil } from "@/utils/CrafterUtil";
import { NextResponse } from "next/server";

const { default: builderService } = require("@/services/builderService");

export const createController = async (request) =>{
    try {
        const { markup, style, data, outputFileName, pdfOutput } = await request.json();
        const zipStream = await builderService.create({ markup, style, data });
        const craftXResponse = new NextResponse(zipStream, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition':
              'attachment; filename=' + outputFileName + '.craftx',
          },
        });

        if (!pdfOutput) return craftXResponse; 
        
        const craftxBlob = await craftXResponse.blob();
        const pdf = await CrafterUtil.buildPdf(craftxBlob);
        return new NextResponse(pdf, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition':
              'attachment; filename=' + outputFileName + '.pdf',
          },
        });
    } catch (error) {
        return NextResponse.json({error: error.mesage},{status: 500});
    }
}
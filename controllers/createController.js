import { NextResponse } from "next/server";

const { default: builderService } = require("@/services/builderService");

export const createController = async (request) =>{
    try {
        const { markup, style, data, outputFileName } = await request.json();
        const zipStream = await builderService.create({ markup, style, data });
        return new NextResponse(zipStream, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition':
              'attachment; filename=' + outputFileName + '.craftx',
          },
        });
    } catch (error) {
        return NextResponse.json({error: error.mesage},{status: 500});
    }
}
import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
import { CrafterUtil } from '@/utils/CrafterUtil';
import { NextResponse } from 'next/server';

const { default: builderService } = require('@/services/builderService');

export const saveController = async (request) => {
  try {
    let body = await request.json();
    let { markup, style, data, folderPath, outputFileName, prompt, craftxPath } =
      body;

      if(craftxPath) {
        console.log("Creating PDF from " + craftxPath);
        const craftxBlob = await CloudKeeperUtil.downloadFile(uid, craftxPath);
        const pdfBlob = await CrafterUtil.buildPdf(craftxBlob);
        await CloudKeeperUtil.uploadFile(await pdfBlob.arrayBuffer(), uid, {
          folderPath,
          fileName: outputFileName + '.pdf',
          type: 'application/pdf',
        });
        await CloudKeeperUtil.uploadFile(await pdfBlob.arrayBuffer(), uid, {
          folderPath,
          fileName: outputFileName + '.pdf',
          type: 'application/pdf',
        });
        return NextResponse.json(
          { message: 'PDF Build Successful' },
          { status: 200 }
        );
      }

    if (prompt) {
      console.log('Building with Artificial Intelligence....');
      const {
        markup: newMarkup,
        style: newStyle,
        data: newData,
        outputFileName: newOutputFileName,
      } = await builderService.buildWithAi(prompt);
      markup = newMarkup;
      style = newStyle;
      data = newData;
      outputFileName = outputFileName + '_' + Date.now().toString();
    }
    const uid = await request.headers.get('userid');
    const { response } = await builderService.save({
      markup,
      style,
      data,
      uid,
      folderPath,
      outputFileName,
    });
    if (prompt) {
      const craftxBlob = await CloudKeeperUtil.downloadFile(uid, response);
      const pdfBlob = await CrafterUtil.buildPdf(craftxBlob);
      await CloudKeeperUtil.uploadFile(await pdfBlob.arrayBuffer(), uid, {
        folderPath,
        fileName: outputFileName + '.pdf',
        type: 'application/pdf',
      });
    }
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
import { CrafterUtil } from '@/utils/CrafterUtil';
import { NextResponse } from 'next/server';

const { default: builderService } = require('@/services/builderService');

export const saveController = async (request) => {
  try {
    let body = await request.json();
    let { markup, style, data, folderPath, outputFileName, prompt } =
      body;
    console.log(body);
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

import { AppConstants } from '@/Constants/AppConstants';
import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
import { CrafterUtil } from '@/utils/CrafterUtil';
import { LoggerUtil } from '@/utils/LoggerUtil';
import { NextResponse } from 'next/server';

const { default: builderService } = require('@/services/builderService');

export const saveController = async (request) => {
  try {
    let body = await request.json();
    const uid = await request.headers.get('userid');
    let { markup, style, data, folderPath, outputFileName, prompt, craftxPath, clone } =
      body;

      
      if(clone){
        LoggerUtil.info("Cloning..." + clone);
        const craftxBlob = await CloudKeeperUtil.downloadFile(AppConstants.TEMPLATES_ROOT_DIR_ALIAS, clone);
        const parsedCraftx = await CrafterUtil.parseCraftx(craftxBlob);
        markup = parsedCraftx.ejsContent??"";
        style = parsedCraftx.style??"*{}";
        data = JSON.stringify(parsedCraftx.data) ?? '{}';
        LoggerUtil.info("Data",data);
        outputFileName += ('_'+Date.now().toString());
      }

      if(craftxPath) {
        LoggerUtil.info("Creating PDF from " + craftxPath);
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
        LoggerUtil.info('Building with Artificial Intelligence....');
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
    
    const { response } = await builderService.save({
      markup,
      style,
      data,
      uid,
      folderPath,
      outputFileName
    });
    if(clone){
      return new Response(JSON.stringify({ response: "Cloned Successfully" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });  
    }
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

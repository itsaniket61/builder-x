import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
import { CrafterUtil } from '@/utils/CrafterUtil';
import { aiService } from './aiService';
import { LoggerUtil } from '@/utils/LoggerUtil';

const fs = require('fs');
const archiver = require('archiver');

const create = async ({ markup, style, data }) => {
  const uuid = Date.now().toString();
  const tempDir = '/tmp/' + uuid + '/';
  try {
    fs.mkdirSync(tempDir, { recursive: true });

    fs.writeFileSync(tempDir + 'index.ejs', markup);
    fs.writeFileSync(tempDir + 'style.css', style);
    fs.writeFileSync(tempDir + 'data.json', data);

    // Create a zip file containing all three files
    const archive = archiver('zip', {
      zlib: { level: 9 }, // set compression level
    });

    archive.file(tempDir + 'index.ejs', { name: 'index.ejs' });
    archive.file(tempDir + 'style.css', { name: 'style.css' });
    archive.file(tempDir + 'data.json', { name: 'data.json' });

    await archive.finalize((err) => {
      if (err) {
        console.error('Error finalizing archive:', err);
        cleanup();
        throw err;
      }
      cleanup();
    });

    function cleanup() {
      try {
        fs.rmSync(tempDir, { recursive: true });
      } catch (cleanupError) {
        console.error('Error cleaning up temp directory:', cleanupError);
      }
    }

    return await archive.read();
  } catch (error) {
    console.error('Error creating archive:', error);
    cleanup();
    throw error;
  }
};

const save = async ({
  markup,
  style,
  data,
  uid,
  folderPath,
  outputFileName,
}) => {
  try {
    // Generate the zip file using the create function
    const buffer = await create({ markup, style, data });
    // Call the asynchronous uploadFile function to upload the generated zip file
    const uploadFile = await CloudKeeperUtil.uploadFile(buffer, uid, {
      folderPath,
      fileName: outputFileName + '.craftx',
      type: 'application/octet-stream',
    });

    if (!uploadFile) throw new Error('Error uploading file');

    // Return success message if upload is successful
    return { response: folderPath + '/' + outputFileName + '.craftx' };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error; // Re-throw the error to propagate it further
  }
};

const buildWithAi = async (prompt) => {
  LoggerUtil.info('Building file with ai... ' + prompt);
  const tempPrompt = prompt;
  try {
    prompt = `Provide a JSON response with HTML markup, CSS styles, and data for an EJS template, adhering to these guidelines: HTML should be within the <body> tag using EJS syntax (<%= $.key %>) without any external tags. CSS should be professional with a good color scheme, fonts, and layout. Include realistic JSON data. The JSON object should have four keys: 'markup' (HTML content within <body>), 'style' (CSS styles), 'data' (JSON string for data), and 'outputFileName' (name of the output file). Ensure the HTML and CSS are professionally designed and follow the specified format strictly. Please follow these instructions strictly and provide the response JSON in the sample output format: ${prompt}.`;
    let text = await aiService.sendRequestToAI(prompt, 'JSON developer');
    LoggerUtil.info("******* Response from AI ********");
    LoggerUtil.info(text);
    return JSON.parse(text);
  } catch (error) {
    LoggerUtil.trace(
      error.message,
      'Retry flag is ' + process.env.AI_ENABLE_FALLBACK
    );
    if(process.env.AI_ENABLE_FALLBACK){
      return buildWithAi(tempPrompt);
    } 
  }
};

const buildPDF = async ({ markup, style, data }) => {
  try {
    // Generate the zip file using the create function
    const buffer = await create({ markup, style, data });
    // Call the asynchronous uploadFile function to upload the generated zip file
    return await CrafterUtil.buildPdf(buffer);
  } catch (error) {
    console.error('Error saving file:', error);
    throw error; // Re-throw the error to propagate it further
  }
};

const builderService = { create, save, buildWithAi, buildPDF };

export default builderService;

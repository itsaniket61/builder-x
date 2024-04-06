import { CloudKeeperUtil } from '@/utils/CloudKeeperUtil';
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
      fileName: outputFileName+'.craftx',
      type: 'application/octet-stream',
    });

    if (!uploadFile) throw new Error('Error uploading file');

    // Return success message if upload is successful
    return { response: folderPath+'/'+outputFileName +'.craftx' };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error; // Re-throw the error to propagate it further
  }
};

const buildWithAi = async(prompt)=>{
  const tempPrompt = prompt;
  try {
    prompt = `
  This is the smaple output format in which i have markup code for HTML body written in ejs [Don't write tags : <html>, <style>, etc markup only contains <body> tag], style written is css and Json Data which is used in ejs. To use data in ejs $.key is used to access.
  {
    "markup":"<<h1>Hello, <%= $.name %>!</h1>",
    "style":"body { background-color: #f0f0f0; }",
    "data": "{ \"name\": \"Aniket\", \"age\": 30 }",
    "outputFileName":"Aniket"
  }
  Give best possible html markup template. 
  Give such json for instructions : ${prompt}
`;
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.log("Retrying...");
    return buildWithAi(tempPrompt);
  }
}

const builderService = {create, save, buildWithAi}

export default builderService;
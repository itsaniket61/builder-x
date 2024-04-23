export const buildUtil = {
  buildWithAi: async ({ folderPath, outputFileName, prompt }) => {
    const url = '/gateway/api/builder/v1/save';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        folderPath: folderPath,
        outputFileName: outputFileName,
        prompt: prompt,
      }),
    };
    const req = await fetch(url, options);
    if (req.status == 200) {
      const res = await req.json();
      return res;
    }
    const res = await req.json();
    throw new Error(res.error);
  },
  buildWithCraftx: async ({ folderPath, outputFileName, craftxPath }) => {
    const url = '/gateway/api/builder/v1/save';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        folderPath: folderPath,
        outputFileName: outputFileName,
        craftxPath: craftxPath
      }),
    };
    const req = await fetch(url, options);
    if (req.status == 200) {
      const res = await req.json();
      return res;
    }
    throw new Error("Failed to Build PDF from CRAFTX");
  },
};
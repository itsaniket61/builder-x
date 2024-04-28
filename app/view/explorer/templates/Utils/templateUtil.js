export const templateUtil = {
  cloneTemplate: async ({ folderPath, outputFileName, cloneTemplate }) => {
    const url = '/gateway/api/builder/v1/save';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        folderPath: folderPath,
        outputFileName: outputFileName,
        clone: cloneTemplate,
      }),
    };
    const req = await fetch(url, options);
    if (req.status == 200) {
      const res = await req.json();
      return res;
    }
    throw new Error('Failed to Build PDF from CRAFTX');
  },
};
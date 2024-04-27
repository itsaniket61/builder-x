export const editorUtil = {
  parseCraftx: async (craftxPath) => {
    const url = '/gateway/api/builder/v1/craftx/parse';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        craftxPath: craftxPath,
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
  save: async ({ markup, style, data, filePath }) => {
    if (!markup || !style || !data || !filePath) {
      throw new Error('Missing required parameters');
    }

    const lastSeparatorIndex = filePath.lastIndexOf('/');
    const folderPath = filePath.substring(0, lastSeparatorIndex);
    const outputFileNameParts = filePath
      .substring(lastSeparatorIndex + 1)
      .split('.');

    if (outputFileNameParts[1] !== 'craftx')
      throw new Error('Invalid file extension');

    const url = '/gateway/api/builder/v1/save';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        markup: markup,
        style: style,
        data: data,
        folderPath: folderPath,
        outputFileName: outputFileNameParts[0],
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
  preview: async ({ markup, style, data }) => {
    const url = '/gateway/api/builder/v1/create';
    const options = {
      method: 'POST',
      body: JSON.stringify({
        markup: markup ?? '',
        style: style ?? '',
        data: data ?? '',
        pdfOutput: true,
      }),
    };
    const req = await fetch(url, options);
    if (req.status === 200) {
      const blob = await req.blob();
      // Convert PDF blob to Base64 data URI
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    } else {
      const res = await req.json();
      throw new Error(res.error);
    }
  },
  formatJson: (jsonString) => {
    return jsonString
      .replace(/({|}|\[|\])/g, '$1\n')
      .replace(/(,)/g, '$1\n')
      .replace(/([^\{\}\[\],\n]+:)/g, '\t$1');
  },
};
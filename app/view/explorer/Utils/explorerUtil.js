export const explorerUtil = {
  getFiles: async ({ folderPath }) => {
    const url = '/gateway/api/builder/storage/v1/list?folderPath=' + (folderPath??'');
    const req = await fetch(url);
    if (req.ok) {
      const res = await req.json();
      return res;
    }
    const res = await req.json();
    throw new Error(res.error);
  },
  downloadFile: async ({ filePath }) => {
    const url =
      '/gateway/api/builder/storage/v1/download/file?filePath=' +
      (filePath ?? '');
    const req = await fetch(url);
    if (req.ok) {
      const res = await req.json();
      console.log(res);
      return res;
    }
    const res = await req.json();
    throw new Error(res.error);
  }
};
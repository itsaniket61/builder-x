export const explorerUtil = {
  getFiles: async ({ folderPath, getTemplates }) => {
    let url = '/gateway/api/builder/storage/v1/list?folderPath=' + (folderPath??'');
    if(getTemplates) url = '/gateway/api/builder/storage/v1/list/templates';
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
      '/gateway/api/builder/storage/v1/file?filePath=' +
      (filePath ?? '');
    const req = await fetch(url);
    if (req.ok) {
      const res = await req.json();
      return res;
    }
    const res = await req.json();
    throw new Error(res.error);
  },
  deleteFile: async ({ filePath }) => {
    const url =
      '/gateway/api/builder/storage/v1/file?filePath=' +
      (filePath ?? '');
    const req = await fetch(url,{
      method: 'DELETE'
    });
    if (req.ok) {
      const res = await req.json();
      return res;
    }
    throw new Error("Unable to delete file");
  }
};
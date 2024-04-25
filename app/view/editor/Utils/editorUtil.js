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
};
import { AppConstants } from "@/Constants/AppConstants";

export const CrafterUtil = {
  buildPdf: async (craftxBlob) => {
    const url =
      AppConstants.URLS.CRAFTER_SERVICE_URL_V1 + '/build/pdf';
      console.log(url);
    const formData = new FormData();
    formData.append('craftx', craftxBlob, 'input.craftx');
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if(!res.ok) throw new Error('Could not create PDF');
    console.log("PDF created successfully");
    return await res.blob();
  },
};
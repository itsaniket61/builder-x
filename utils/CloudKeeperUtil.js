import { AppConstants } from '@/Constants/AppConstants';

export const CloudKeeperUtil = {
  uploadFile: async (buffer, uid, { folderPath, fileName, type }) => {
    const blob = new Blob([buffer], {
      type: type,
    });
    if(folderPath.startsWith('/')) folderPath = folderPath.substr(1);
    const folderName = 'BuildersX/' + uid + '/' +folderPath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file';
    const formData = new FormData();
    formData.append('file', blob, fileName );
    formData.append('folderName', folderName);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const responseBody = await response.json();
    console.log('Upload successful:', responseBody);
    return response.ok;
  },
  downloadFile: async (uid, filePath)=>{
    filePath = 'BuildersX/' + uid + '/' + filePath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file?filePath=' + filePath;
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const responseBody = await response.json();
    const { downloadUrl } = responseBody.response;
    if (!downloadUrl) throw new Error('Failed to download');
    const downloadRes = await fetch(downloadUrl);
    if(!downloadRes.ok) throw new Error('Failed to download from URL');
    const blob = await downloadRes.blob();
    console.log('Download successful');
    return blob;
  }
};

import { AppConstants } from '@/Constants/AppConstants';
import { LoggerUtil } from './LoggerUtil';

export const CloudKeeperUtil = {
  uploadFile: async (buffer, uid, { folderPath, fileName, type, customMetadata }) => {
    const blob = new Blob([buffer], {
      type: type,
    });
    if(folderPath.startsWith('/')) folderPath = folderPath.substr(1);
    const folderName = AppConstants.ROOT_DIR_ALIAS + '/' + uid + '/' +folderPath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file';
    const formData = new FormData();
    formData.append('file', blob, fileName );
    formData.append('folderName', folderName);
    
    if(customMetadata){
      formData.append('customMetadata', JSON.stringify(customMetadata));
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const responseBody = await response.json();
    LoggerUtil.debug('Upload successful:', responseBody);
    return response.ok;
  },
  getDownloadUrl: async (uid, filePath)=>{
    filePath = AppConstants.ROOT_DIR_ALIAS + '/' + uid + '/' + filePath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file?filePath=' + filePath;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'data': Date.now().toString(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const responseBody = await response.json();
    const { downloadUrl } = responseBody.response;
    return {downloadUrl};
  },
  downloadFile: async (uid, filePath)=>{
    filePath = AppConstants.ROOT_DIR_ALIAS + '/' + uid + '/' + filePath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file?filePath=' + filePath;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        date: Date.now().toString(),
      }
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
    LoggerUtil.debug('Download successful');
    return blob;
  },
  listAllFiles: async (uid, folderName)=>{
    const pathStarter = AppConstants.ROOT_DIR_ALIAS + '/' + uid;
    if(folderName){
      folderName = pathStarter + '/' + folderName;
    }else{
      folderName = pathStarter;
    }
    const url =
      AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/folder?folderName=' + folderName;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'date': Date.now().toString()
      },
    });
    if (!response.ok) {
      throw new Error('Failed to list files');
    }

    const responseBody = await response.json();
    let files = responseBody.response;
    files.name = files.name.replace(pathStarter, '');
    for(let i = 0; i < files.children.length; i++){
      if(files.children[i].name == "") {
        files.children.splice(i, 1);
        i--;
        continue;
      }
      files.children[i].name = files.children[i].name.replace(pathStarter, '');
    }
    if (!files) throw new Error('Failed to list files');
    return files;
  },
  deleteFile: async (uid, filePath)=>{
    filePath = AppConstants.ROOT_DIR_ALIAS + '/' + uid + '/' + filePath;
    const url = AppConstants.URLS.STORAGE_SERVICE_URL_V1 + '/file?path=' + filePath;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'date': Date.now().toString()
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    return true;
  }
};

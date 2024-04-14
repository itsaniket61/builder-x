'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/Hooks/useAuth'
import FolderHierarchy from '@/components/Explorer/FolderHierarchy';
import FileList from '@/components/Explorer/FileList';
import { explorerUtil } from './Utils/explorerUtil';
import Loading from '@/components/Loading/Loading';

function Explorer() {

    useAuth('/view/explorer', '/view/auth');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [folderPath, setFolderPath] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const jsonData = await explorerUtil.getFiles({
              folderPath: folderPath,
            });
            setData(jsonData);
            setIsLoading(false);
          } catch (error) {
            setError(error);
            setIsLoading(false);
          }
        };

        fetchData();
      }, [folderPath]);
    
       if (isLoading) {
         return <Loading/>;
       }

       if (error) {
         return <div>Error: {error.message}</div>;
       }

       const folders = data?.children || [];
       const files = folders;

       const handleFolderSelection = (folderPath) => {
        setFolderPath(folderPath);
       };

    return (
      <div className='flex h-screen'>
        <div className='flex-1 p-2'>
          <FileList files={files} selectFolder={handleFolderSelection} folderPath={folderPath}/>
        </div>
      </div>
    );
}

export default Explorer
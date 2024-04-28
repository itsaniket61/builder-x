'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/Hooks/useAuth'
import FileList from '@/components/Explorer/FileList';
import { explorerUtil } from './Utils/explorerUtil';
import Loading from '@/components/Loading/Loading';

function Explorer() {

    const auth = useAuth('/view/explorer', '/view/auth');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [folderPath, setFolderPath] = useState(null);

    const fetchData = async () => {
      try {
        setData(undefined);
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

      useEffect(() => {
        fetchData();
      }, [folderPath]);
    
       if (isLoading) {
         return (
           <div className='flex justify-center items-center h-screen'>
             <Loading />
           </div>
         );
       }

       if (error) {
         return <div>Error: {error.message}</div>;
       }

       const folders = data!=undefined ? data.children : undefined;
       const files = folders;

       const handleFolderSelection = (folderPath) => {
        setFolderPath(folderPath);
       };

       const refreshList = async () => {
        fetchData();
       }

    if (auth.isLoading) return (
      <div className='flex justify-center items-center h-screen'>
        <Loading />
      </div>
    );

    return (
      <div className='flex h-screen'>
        <div className='mt-12'>
          <FileList files={files} selectFolder={handleFolderSelection} refresh={refreshList} folderPath={folderPath}/>
        </div>
      </div>
    );
}

export default Explorer
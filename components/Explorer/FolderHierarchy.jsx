import Image from 'next/image';
import React from 'react';

const FolderHierarchy = ({ folders,selectFolder }) => {
  const renderFolders = (folders) => {
    return (
      <ul>
        {folders.map((folder, index) => (
          <li key={index}>
            {folder.type === 'directory' ? (
              <div onClick={()=>{
                selectFolder(folder.name);
              }}>
                <span className='flex'>
                  <Image
                    src={'/icons/folder.png'}
                    height={25}
                    width={25}
                  />
                  <span className='mx-2'>{folder.name}</span>
                </span>
                {folder.children && renderFolders(folder.children)}
              </div>
            ) : (
              ''
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='flex-auto border-r border-gray-200 pr-4 h-screen'>
      {renderFolders(folders)}
    </div>
  );
};

export default FolderHierarchy;

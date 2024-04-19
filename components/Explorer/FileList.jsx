import { useEffect, useState } from 'react';
import ContextMenu from '../ui/context-menu';
import { showToast } from '../Toast/Toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '../ui/table';
import { explorerUtil } from '@/app/view/explorer/Utils/explorerUtil';

const FileList = ({ folderPath, files, selectFolder, refresh }) => {
  const iconsMap = {
    pdf: '/icons/pdf.png',
    craftx: '/icons/document.png',
  };

  const [contextMenuOptions, setContextMenuOptions] = useState({});
  const [routingStack, setRoutingStack] = useState([]);

  useEffect(() => {
    selectFolder(routingStack.join('/'));
    console.log('Routing changed');
  }, [routingStack]);

  const handleListItemClick = async (file) => {
    if (file.type === 'directory') {
      setRoutingStack([...routingStack, file.name]); // Update routing stack with immutability
    }
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    const folderMenuOptions = [
      {
        label: 'Rename',
        action: async () => {
          console.log('Downloading file:', file);
        },
      },
      {
        label: 'Delete',
        action: () => {
          console.log('Deleting file:', file);
        },
      },
    ];

    const fileMenuOptions = [
      {
        label: 'Rename',
        action: async () => {
          console.log('Downloading file:', file);
        },
      },
      {
        label: 'Download',
        action: async () => {
          const { downloadUrl } = await explorerUtil.downloadFile({
            filePath: folderPath + '/' + file.name,
          });
          window.open(downloadUrl, '_blank');
        },
      },
      {
        label: 'Delete',
        action: async () => {
          console.log('Deleting file:', file);
          await explorerUtil.deleteFile({
            filePath: routingStack.join('/') + '/' + file.name,
          });
          refresh();
          showToast('File deleted successfully');
        },
      },
    ];
    if (file.type === 'directory') {
      setContextMenuOptions({
        options: folderMenuOptions,
        position: { x: event.clientX, y: event.clientY },
      });
    } else {
      setContextMenuOptions({
        options: fileMenuOptions,
        position: { x: event.clientX, y: event.clientY },
      });
    }
  };


  return (
    <>
      <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {
          routingStack.map((folder,index)=>(<>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink className='cursor-pointer' onClick={()=>{
              setRoutingStack(routingStack.slice(0,index+1));
            }}>{folder}</BreadcrumbLink>
            </BreadcrumbItem>
            </>))
        }
        </BreadcrumbList>
      </Breadcrumb>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const fileName = file.name;
            const ext = fileName.split('.').at(-1);
            const name =
              file.name.length > 16
                ? file.name.substr(0, 16) + '....'
                : fileName;
            return (
              <TableRow
                key={index}
                className='cursor-pointer'
                onContextMenu={(event) => handleContextMenu(event, file)}
              >
                <TableCell
                  className='font-medium'
                  onClick={(e) => handleListItemClick(file)}
                >
                  <img
                    src={
                      file.type == 'directory'
                        ? '/icons/folder.png'
                        : iconsMap[ext] ?? '/icons/file-icon.svg'
                    }
                  />
                </TableCell>
                <TableCell onClick={(e) => handleListItemClick(file)}>
                  {name}
                </TableCell>
                <TableCell onClick={(e) => handleListItemClick(file)}>
                  {file.created_at}
                </TableCell>
                <TableCell onClick={(e) => handleListItemClick(file)}>
                  {file.modified_at}
                </TableCell>
                <TableCell onClick={(e) => handleContextMenu(e, file)}>
                  ...
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ContextMenu
        options={contextMenuOptions.options}
        position={contextMenuOptions.position || { x: 0, y: 0 }}
        onClose={() => setContextMenuOptions({})}
      />
    </>
  );
};

export default FileList;

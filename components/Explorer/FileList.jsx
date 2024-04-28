import { useEffect, useState } from 'react';
import ContextMenu from '../ui/context-menu';
import { processWithToast, showToast } from '../Toast/Toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '../ui/table';
import { explorerUtil } from '@/app/view/explorer/Utils/explorerUtil';
import Image from 'next/image';
import { Button } from '../ui/button';
import { EllipsisVertical, RefreshCcw } from 'lucide-react';
import { buildUtil } from '@/app/view/build/Utils/buildUtil';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { templateUtil } from '@/app/view/explorer/templates/Utils/templateUtil';

const FileList = ({ folderPath, files, selectFolder, refresh, isTemplatesList }) => {
  const router = useRouter();
  
  const iconsMap = {
    pdf: '/icons/pdf-icon.png',
    craftx: '/icons/file-icon.png',
  };

  const [contextMenuOptions, setContextMenuOptions] = useState({});
  const [routingStack, setRoutingStack] = useState([]);

  useEffect(() => {
    selectFolder(routingStack.join('/'));
  }, [routingStack]);

  const handleListItemClick = async (file) => {
    if (file.type === 'directory') {
      setRoutingStack([...routingStack, file.name]); // Update routing stack with immutability
    }
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    const fileExtension = file.name.split('.').at(-1);
    
    const templateMenuOptions = [
      {
        label: 'Clone',
        action: async () => {
          const folderPath = prompt("Enter folder path");
          const fileName = prompt("Enter file name");
            processWithToast({
              startMessage: 'Cloning...',
              successMessage: 'File cloned successfully',
              failureMessage: 'Failed to clone file',
            },
              templateUtil.cloneTemplate({
                folderPath: folderPath,
                outputFileName: fileName,
                cloneTemplate: file.name,
              })
            );
        },
      },
      {
        label: 'Add to Favorites',
        action: () => {},
      },
    ];
    
    const folderMenuOptions = [
      {
        label: 'Rename',
        action: async () => {},
      },
      {
        label: 'Delete',
        action: () => {},
      },
    ];

    let fileMenuOptions = [
      {
        label: 'Rename',
        action: async () => {},
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
          processWithToast(
            {
              startMessage: 'Deleting file...',
              successMessage: 'File deleted successfully',
              failureMessage: 'Failed to delete file',
            },
            explorerUtil.deleteFile({
              filePath: routingStack.join('/') + '/' + file.name,
            }).then(()=>
          refresh())
          );
        },
      },
    ];

    if (fileExtension == 'craftx') {
      //Added Edit Option
      fileMenuOptions.push({
        label: 'Edit',
        action: async () => {
          try {
            const fileName = file.name;
            const path = routingStack.join('/');
            router.push('/view/editor?craftx=' + path + '/' + fileName);
          } catch (error) {
            showToast('Failed to build PDF', 'error');
          }
        },
      });

      //Added Build PDF Option
      fileMenuOptions.push({
        label: 'Build PDF',
        action: async () => {
          try {
            const fileName = file.name.split('.')[0];
            const path = routingStack.join('/');
            await buildUtil.buildWithCraftx({
              folderPath: path,
              outputFileName: fileName,
              craftxPath: path + '/' + file.name,
            });
            refresh();
            showToast('PDF built successfully');
          } catch (error) {
            showToast('Failed to build PDF', 'error');
          }
        },
      });
    }
    if (file.type === 'directory') {
      setContextMenuOptions({
        options: folderMenuOptions,
        position: { x: event.clientX, y: event.clientY },
      });
    } else if (isTemplatesList) {
      setContextMenuOptions({
        options: templateMenuOptions,
        position: { x: event.clientX, y: event.clientY },
      })
    } else {
      setContextMenuOptions({
        options: fileMenuOptions,
        position: { x: event.clientX, y: event.clientY },
      });
    }
  };

  return (
    <>
      <Breadcrumb className='fixed w-full bg-card z-50 pl-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className='cursor-pointer'
              onClick={(e) => setRoutingStack([])}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {routingStack.map((folder, index) => (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className='cursor-pointer'
                  onClick={() => {
                    setRoutingStack(routingStack.slice(0, index + 1));
                  }}
                >
                  {folder}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ))}
          <div className='ml-auto mr-3'>
            <Button
              size='icon'
              variant='outline'
              className='cursor-pointer'
              onClick={refresh}
            >
              <RefreshCcw className={!files && 'animate-spin'} />
            </Button>
          </div>
        </BreadcrumbList>
      </Breadcrumb>
      {(files && files.length == 0) ?
      (<div className='flex justify-center items-center h-full w-screen'>
        <div className='mx-auto h-1/2'>
          <Image src='/icons/empty-box.png' height={125} width={125} />
          <h4 className='text-center'>Folder is Empty</h4>
        </div>
      </div>):
      (<div className='w-screen mt-10'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Modified</TableHead>
            </TableRow>
          </TableHeader>
          {!files ? (
            Array(10)
              .fill(0)
              .map((e, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-12 w-12 rounded-full' />
                    </TableCell>
                    <TableCell>
                      <div className='flex'>
                        <span className='hover:text-primary w-full'>
                          <Skeleton className='h-4 w-[250px] my-1' />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-[250px] my-1' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-[250px] my-1' />
                    </TableCell>
                  </TableRow>
                );
              })
          ) : (
            <TableBody>
              {files.map((file, index) => {
                const fileName = file.name;
                const ext = fileName.split('.').at(-1);
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
                            ? '/icons/folder-icon.png'
                            : iconsMap[ext] ?? '/icons/file-icon.svg'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className='flex'>
                        <span
                          className='hover:text-primary w-full'
                          onClick={(e) => handleListItemClick(file)}
                        >
                          {fileName}
                        </span>
                        <span
                          className='w-min'
                          onClick={(e) => handleContextMenu(e, file)}
                        >
                          <EllipsisVertical className='hover:text-primary inline float-right text-xs text-gray-500' />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => handleListItemClick(file)}>
                      {file.created_at}
                    </TableCell>
                    <TableCell onClick={(e) => handleListItemClick(file)}>
                      {file.modified_at}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>)}
      <ContextMenu
        options={contextMenuOptions.options}
        position={contextMenuOptions.position || { x: 0, y: 0 }}
        onClose={() => setContextMenuOptions({})}
      />
    </>
  );
};

export default FileList;

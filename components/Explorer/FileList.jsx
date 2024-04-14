import { explorerUtil } from '@/app/view/explorer/Utils/explorerUtil';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useState } from 'react';

const FileList = ({ folderPath, files, selectFolder }) => {
  const iconsMap = {
    pdf: '/icons/pdf.png',
    craftx: '/icons/document.png',
  };
  const [currentSelectedFile, setCurrentSelectedFile] = useState(undefined);

  return (
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
                onClick={async () => {
                  if (file.type === 'directory') {
                    selectFolder(file.name);
                  } else {
                    setCurrentSelectedFile(file);
                    const { downloadUrl } = await explorerUtil.downloadFile({
                      filePath: folderPath + '/' + currentSelectedFile.name,
                    });
                    window.open(downloadUrl, '_blank');
                  }
                }}
              >
                <TableCell className='font-medium'>
                  <img
                    src={
                      file.type == 'directory'
                        ? '/icons/folder.png'
                        : iconsMap[ext] ?? '/icons/file-icon.svg'
                    }
                  />
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell>{file.modified_at}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
};

export default FileList;

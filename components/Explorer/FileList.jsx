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
    <ContextMenu>
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
                    console.log(currentSelectedFile);
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

      <ContextMenuTrigger>
        
      </ContextMenuTrigger>
      <ContextMenuContent className='w-64'>
        <ContextMenuItem
          inset
          onClick={async () => {
            const { downloadUrl } = await explorerUtil.downloadFile({
              filePath: folderPath + '/' + currentSelectedFile.name,
            });
            window.open(downloadUrl, '_blank');
          }}
        >
          Download
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className='w-48'>
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value='pedro'>
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value='pedro'>
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value='colm'>Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FileList;

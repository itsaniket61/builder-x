'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { editorUtil } from './Utils/editorUtil';
import { useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { processWithToast, showToast, statusToast } from '@/components/Toast/Toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Eye, SaveIcon } from 'lucide-react';
import DynamicForm from './components/DynamicForm';

function Editor() {

  const params = useSearchParams();
  const craftxFile = params.get('craftx');
  const [markup, setMarkup] = useState('');
  const [style, setStyle] = useState('');
  const [data, setData] = useState('');
  const [jsonData, setJsonData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(undefined);

  const preview = async () => {
    try {
      const pdfUrl = await editorUtil.preview({ markup, style, data });
      setPreviewUrl(pdfUrl);
    } catch (error) {
      console.error(error);
      showToast('Failed to load preview', 'error');
    }
  };

  const save = async () => {
    processWithToast(
      {
        startMessage: 'Saving file...',
        successMessage: 'File saved successfully',
        failureMessage: 'Failed to save file',
      },
      editorUtil.save({ markup, style, data, filePath: craftxFile })
    );
  };

  useEffect(() => {
    const parseCraftx = async (craftxFile) => {
      const parsedCraftx = await editorUtil.parseCraftx(craftxFile);
      console.log(parsedCraftx);
      setMarkup(parsedCraftx.ejsContent??'');
      setStyle(parsedCraftx.cssContent ?? '*{}');
      setData(JSON.stringify(parsedCraftx.data ?? ''));
      setJsonData(parsedCraftx.data ?? {});
    };
    parseCraftx(craftxFile);
  }, []);

  const side = "bottom";
  return (
    <div className='h-1/2 mt-14'>
      <div className='flex border'>
        <div className='w-min p-2'>
          <Button variant='outline' size='icon' className='mb-1' onClick={save}>
            <SaveIcon />
          </Button>
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='mb-1'
                onClick={preview}
              >
                <Eye />
              </Button>
            </SheetTrigger>
            <SheetContent side={side} className='h-screen'>
              <SheetHeader>
                <SheetTitle>{craftxFile || 'Loading....'}</SheetTitle>
              </SheetHeader>
              <div className='p-1 h-screen overflow-scroll'>
                {previewUrl && (
                  <iframe src={previewUrl} className='w-full h-full' />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className='w-full border'>
          <Tabs defaultValue='markup' className='w-full'>
            <div className='p-1'>
              <TabsList className='w-full md:w-min'>
                <TabsTrigger value='data'>DATA</TabsTrigger>
                <TabsTrigger value='markup'>MARKUP</TabsTrigger>
                <TabsTrigger value='style'>STYLE</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='data'>
              <div className='p-2'>
                <DynamicForm
                  jsonData={jsonData}
                  onChange={(changedData) => {
                    setData(JSON.stringify(changedData));
                    setJsonData(changedData);
                    console.log(changedData, data);
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value='markup'>
              <Textarea
                className='h-screen'
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
              />
            </TabsContent>
            <TabsContent value='style'>
              <Textarea
                className='h-screen'
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Editor;

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { editorUtil } from './Utils/editorUtil';
import { useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/Toast/Toast';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Eye } from 'lucide-react';

function Editor() {
  const params = useSearchParams();
  const craftxFile = params.get('craftx');
  const [markup, setMarkup] = useState('');
  const [style, setStyle] = useState('');
  const [data, setData] = useState('');
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
    try {
      const save = await editorUtil.save({ markup, style, data, filePath:craftxFile });
      showToast('Saved Successfully');
    } catch (error) {
      console.error(error);
      showToast(error, 'error');
    }
  };

  useEffect(() => {
    const parseCraftx = async (craftxFile) => {
      const parsedCraftx = await editorUtil.parseCraftx(craftxFile);
      console.log(parsedCraftx);
      setMarkup(parsedCraftx.ejsContent??'');
      setStyle(parsedCraftx.style??'*{}');
      setData(JSON.stringify(parsedCraftx.data ?? ''));
    };
    parseCraftx(craftxFile);
  }, []);

  const side = "bottom";
  return (
    <div className='h-1/2'>
      <div className='flex border'>
        <div className='w-min p-2'>
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant='outline'>
                <Eye />
              </Button>
            </SheetTrigger>
            <SheetContent side={side} className='h-screen'>
              <SheetHeader>
                <SheetTitle>{craftxFile || 'Loading....'}</SheetTitle>
                <SheetFooter className='float-start'>
                  <SheetClose asChild className='my-2 md:my-0'>
                    <Button onClick={save} variant='outline' className='mx-2'>
                      Save
                    </Button>
                  </SheetClose>
                  <Button onClick={preview} variant='outline' className='mx-2'>
                    Preview
                  </Button>
                </SheetFooter>
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
                <TabsTrigger value='markup'>MARKUP</TabsTrigger>
                <TabsTrigger value='style'>STYLE</TabsTrigger>
                <TabsTrigger value='data'>DATA</TabsTrigger>
              </TabsList>
            </div>
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
            <TabsContent value='data'>
              <Textarea
                className='h-screen'
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Editor;

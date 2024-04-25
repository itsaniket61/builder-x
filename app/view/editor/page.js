'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { editorUtil } from './Utils/editorUtil';
import { useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';


function Editor() {
    const params = useSearchParams();
    const craftxFile = params.get('craftx');
    const [markup, setMarkup] = useState("");
    const [style, setStyle] = useState("craftxFile.style");
    const [data, setData] = useState("craftxFile.data");

    useEffect(()=>{
      const parseCraftx = async (craftxFile) => {
        const parsedCraftx = await editorUtil.parseCraftx(craftxFile);
        console.log(parsedCraftx);
        setMarkup(parsedCraftx.ejsContent);
        setStyle(parsedCraftx.style);
        setData(JSON.stringify(parsedCraftx.data));
      };
      parseCraftx(craftxFile);
    },[]);

  return (
    <div className='h-screen'>
      <div className='sm:p-10'>
        <Tabs defaultValue='markup' className='w-[400px]'>
          <TabsList>
            <TabsTrigger value='markup'>MARKUP</TabsTrigger>
            <TabsTrigger value='style'>STYLE</TabsTrigger>
            <TabsTrigger value='data'>DATA</TabsTrigger>
          </TabsList>
          <TabsContent value='markup'>
            <Textarea>{markup}</Textarea>
          </TabsContent>
          <TabsContent value='style'>
            <Textarea>{style}</Textarea>
          </TabsContent>
          <TabsContent value='data'>
            <Textarea>{data}</Textarea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Editor;

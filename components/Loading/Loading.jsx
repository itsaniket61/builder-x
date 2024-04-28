import { Loader2 } from 'lucide-react';
import React from 'react';

function Loading() {
  return (
    <Loader2 className='h-10 w-10 md:h-20 md:w-20 animate-spin'/>
  );
}

export default Loading;

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export function MobileNavbar({ menuItems }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='mt-1' variant='outline'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>DocuFlow</SheetTitle>
          <SheetDescription>
            Convert Imagination into something
          </SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          {menuItems.map((item, id) => (
            <Link
              href={item.href}
              key={id}
              className='block px-4 py-2 font-medium'
            >
              {item.name}
            </Link>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

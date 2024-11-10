import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@c/core/components/Button';
import { Card, CardContent } from '@c/core/components/Card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@c/core/components/Drawer';

import CommentForm from './CommentForm';

const sampleData = Array.from({ length: 50 }, (_, index) => ({
  postId: index + 6,
  commentId: index + 9,
  content: `Content for comment ${index + 1}`,
  creator: index % 2 === 0,
  likes: index,
}));
type SampleData = (typeof sampleData)[0];

export default function Comment() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <>
          <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
            <MessageCircle />
          </Button>
          <p>5</p>
        </>
      </DrawerTrigger>
      <DrawerContent className="mx-auto h-full max-w-screen-lg">
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto">
          {sampleData.map((item: SampleData) => (
            <div key={item.commentId}>
              <Card className="rounded-none">
                <CardContent className="space-y flex flex-row items-center justify-between p-6">
                  <p>{item.content}</p>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('LIKE')}
                    >
                      <Heart />
                    </Button>
                    <p>{item.likes}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <DrawerFooter className="sticky bottom-0">
          <CommentForm />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

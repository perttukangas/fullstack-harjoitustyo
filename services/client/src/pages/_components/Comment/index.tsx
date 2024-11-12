import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@c/core/components/Button';
import { Card, CardContent, CardFooter } from '@c/core/components/Card';
import DrawerDialog from '@c/core/components/DrawerDialog';

import CommentForm from './CreateForm';
import EditForm from './EditForm';
import RemoveComment from './RemoveComment';

const sampleData = Array.from({ length: 50 }, (_, index) => ({
  commentId: index + 9,
  content: `Content for comment ${index + 1}`,
  creator: index % 2 === 0,
  likes: index,
}));
type SampleData = (typeof sampleData)[0];

export default function Comment({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialog
      trigger={
        <>
          <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
            <MessageCircle />
          </Button>
          <p>5</p>
        </>
      }
      title={`Title id:${postId}`}
      description="Description"
      open={open}
      setOpen={setOpen}
      footer={<CommentForm postId={postId} />}
    >
      {sampleData.map((item: SampleData) => (
        <div key={item.commentId}>
          <Card className="rounded-none">
            <CardContent className="flex flex-row items-center justify-between p-6">
              <p>{item.content}</p>
              <div className="flex items-center justify-start">
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
            {item.creator && (
              <CardFooter className="justify-end">
                <EditForm {...item} />
                <RemoveComment />
              </CardFooter>
            )}
          </Card>
        </div>
      ))}
    </DrawerDialog>
  );
}

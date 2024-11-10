import { Heart } from 'lucide-react';

import { Button } from '@c/core/components/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@c/core/components/Card';

import Comment from './_components/Comment';
import PostForm from './_components/Post/PostForm';
import RemovePost from './_components/Post/RemovePost';

const sampleData = Array.from({ length: 10 }, (_, index) => ({
  postId: index + 6,
  title: `Title ${index + 1}`,
  content: `Content for post ${index + 1}`,
  creator: index % 2 === 0,
  likes: index,
  comments: index + 5,
}));
type SampleData = (typeof sampleData)[0];

export default function Home() {
  return (
    <main>
      {sampleData.map((item: SampleData) => (
        <div key={item.postId}>
          <Card className="rounded-none">
            <CardHeader className="flex-row items-center justify-between gap-1">
              <CardTitle>{item.title}</CardTitle>
              {item.creator && (
                <div className="flex items-center gap-1">
                  <PostForm edit={item} />
                  <RemovePost />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
            </CardContent>
            <CardFooter className="flex-row items-center justify-start gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('LIKE')}
              >
                <Heart />
              </Button>
              <p>{item.likes}</p>
              <Comment />
            </CardFooter>
          </Card>
        </div>
      ))}
    </main>
  );
}

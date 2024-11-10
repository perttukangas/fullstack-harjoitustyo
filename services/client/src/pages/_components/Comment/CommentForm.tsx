import { Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@c/core/components/Button';
import { Input } from '@c/core/components/Input';

import { type CreateInput, createInput } from '@apiv1/post/comment/validators';

export default function CommentForm() {
  const postId = 1;

  const [content, setContent] = useState('');

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('SUBMIT', content, postId);
    setContent('');
  };

  // TODO VALIDATOR

  return (
    <div className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="New comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        onClick={() => {
          void onSubmit();
        }}
        type="submit"
        variant="ghost"
        size="icon"
      >
        <Send />
      </Button>
    </div>
  );
}

import { Link } from '@tanstack/react-router';

import { Button } from '@c/core/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@c/core/components/Card';

export default function NotFound() {
  return (
    <div className="m-10 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Page not found</CardTitle>
          <CardDescription className="text-center">
            Sorry, the page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button>
            <Link to={'/'}>Go back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}

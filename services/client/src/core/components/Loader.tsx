import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoaderProps {
  delay?: number;
}

export default function Loader({ delay = 1000 }: LoaderProps) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!showLoader) {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}

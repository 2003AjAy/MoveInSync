import { Loader } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative inline-flex">
          <Loader className="h-12 w-12 text-indigo-600 animate-spin" />
        </div>
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
}
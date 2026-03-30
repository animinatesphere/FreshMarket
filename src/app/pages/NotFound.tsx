import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl text-green-600 mb-4">404</h1>
        <h2 className="text-3xl mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

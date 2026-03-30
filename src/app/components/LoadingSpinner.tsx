import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader className="h-12 w-12 text-orange-600 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Loading</h3>
          <p className="text-sm text-gray-600">
            Please wait while we fetch your content...
          </p>
        </div>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-3">
        <Loader className="h-8 w-8 text-orange-600 animate-spin mx-auto" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

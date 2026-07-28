import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader className="h-12 w-12 text-primary animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Loading</h3>
          <p className="text-sm text-muted-foreground">
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
        <Loader className="h-8 w-8 text-primary animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

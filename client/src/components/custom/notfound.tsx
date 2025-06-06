import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotFoundProps = {
  resourceName?: string
  hasButton?: boolean
}

export const NotFound: React.FC<NotFoundProps> = ({ resourceName = 'resource', hasButton = false }) => {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>404 - Not Found</CardTitle>
          <CardDescription>
            The {resourceName} you are looking for could not be found.
          </CardDescription>
        </CardHeader>
        {hasButton && (
          <CardContent className="space-y-4">
            <Button onClick={handleBack} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

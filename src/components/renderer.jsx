import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, ExternalLink } from 'lucide-react';

const ComponentBuilder = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildResult, setBuildResult] = useState(null);
  const editorRef = useRef(null);

  const defaultCode = `// Example component
function ExampleComponent() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Hello World</h2>
            <p>This is a sample component</p>
        </div>
    );
}

export default ExampleComponent;`;

  const handleBuild = async () => {
    setError('');
    setStatus('Building...');
    setIsBuilding(true);

    try {
      const response = await fetch('http://localhost:3000/api/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentCode: editorRef.current.value })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Build failed');
      }

      const result = await response.json();
      setBuildResult(result);
      setStatus('Build successful!');
      setIsPreviewMode(true);
    } catch (err) {
      setError(err.message);
      setStatus('');
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                React Component Builder
              </CardTitle>
              <CardDescription className="text-gray-600">
                Paste your React component code below and click "Build" to get the compiled dist folder.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="preview-mode" className="text-sm text-gray-600">
                Code
              </Label>
              <Switch
                id="preview-mode"
                checked={isPreviewMode}
                onCheckedChange={setIsPreviewMode}
              />
              <Label htmlFor="preview-mode" className="text-sm text-gray-600">
                Preview
              </Label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className={`transition-opacity duration-300 ${isPreviewMode ? 'hidden' : 'block'}`}>
            <textarea
              ref={editorRef}
              defaultValue={defaultCode}
              className="w-full h-96 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              spellCheck="false"
            />
          </div>

          <div className={`transition-opacity duration-300 ${!isPreviewMode ? 'hidden' : 'block'}`}>
            {buildResult && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={buildResult.deploymentUrl}
                  className="w-full h-[80vh] border-0"
                  title="Component Preview"
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBuild}
              disabled={isBuilding}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isBuilding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building...
                </>
              ) : (
                'Build Component'
              )}
            </Button>
            {status && <span className="text-gray-600">{status}</span>}
          </div>

          {buildResult && (
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a
                  href={buildResult.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={buildResult.downloadUrl}>
                  <Download className="mr-2 h-4 w-4" />
                  Download ZIP
                </a>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ComponentBuilder;
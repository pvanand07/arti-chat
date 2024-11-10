import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, ExternalLink } from 'lucide-react';

const ComponentBuilder = ({ initialCode }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildResult, setBuildResult] = useState(null);
  const editorRef = useRef(null);

  const defaultCode = initialCode || `// Example component
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
    setStatus('Building... (this may take up to 1 minute)');
    setIsBuilding(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('https://www.react-renderer.elevatics.online/api/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ componentCode: editorRef.current.value }),
        signal: controller.signal,
        keepalive: true,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Build failed');
      }

      const result = await response.json();
      const processedResult = {
        ...result,
        deploymentUrl: `https://react-renderer.elevatics.online${result.deploymentUrl}`,
        downloadUrl: `https://react-renderer.elevatics.online${result.downloadUrl}`
      };
      
      console.log('Processed build result:', processedResult);
      setBuildResult(processedResult);
      setStatus('Build successful!');
      setIsPreviewMode(true);
    } catch (err) {
      console.error('Build error:', err);
      if (err.name === 'AbortError') {
        setError('Build request timed out. Please try again.');
      } else if (err.message.includes('SSL') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        setError('Connection error. The build service might be starting up. Please try again in a moment.');
      } else {
        setError(err.message || 'Failed to build component. Please try again.');
      }
      setStatus('');
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="h-full">
      <Card className="h-full bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">
                React Component Builder
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Edit the component code and click "Build" to preview
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

        <CardContent className="flex-1 overflow-hidden">
          <div className={`h-full transition-opacity duration-300 ${isPreviewMode ? 'hidden' : 'block'}`}>
            <textarea
              ref={editorRef}
              defaultValue={defaultCode}
              className="w-full h-[calc(100vh-300px)] p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              spellCheck="false"
            />
          </div>

          <div className={`h-full transition-opacity duration-300 ${!isPreviewMode ? 'hidden' : 'block'}`}>
            {buildResult ? (
              <div className="h-[calc(100vh-300px)] border rounded-lg overflow-hidden bg-white">
                <iframe
                  key={buildResult.deploymentUrl}
                  src={buildResult.deploymentUrl}
                  className="w-full h-full border-0"
                  title="Component Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] flex items-center justify-center border rounded-lg bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Build the component to see preview</p>
                  <p className="text-gray-400 text-sm">First build may take up to 1 minute</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                {error}
                {error.includes('starting up') && (
                  <div className="text-sm mt-1">
                    The build service may need a moment to start up on first use.
                  </div>
                )}
              </AlertDescription>
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
            {status && <span className="text-gray-600 text-sm">{status}</span>}
          </div>

          {buildResult && (
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={buildResult.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
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
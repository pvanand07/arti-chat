import React, { useMemo } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { dracula } from '@codesandbox/sandpack-themes';
import {
  sharedFiles,
  sharedOptions,
  getDependencies,
  getTemplate,
  getArtifactFilename,
} from './utils/artifacts';

// Update shadcn component imports to match the sandbox file structure
const updateShadcnImports = (code: string): string => {
  return code
    // Handle @/components/ui/ pattern
    .replace(
      /@\/components\/ui\/([\w-]+)/g,
      '/components/ui/$1'
    )
    // Handle @components/ui/ pattern
    .replace(
      /@components\/ui\/([\w-]+)/g,
      '/components/ui/$1'
    )
    // Handle direct imports from shadcn
    .replace(
      /from ["'](\.|@|~)?\/?(components\/ui\/[\w-]+)["']/g,
      'from "/$2"'
    );
};

interface CodeRendererProps {
  code: string;
  showEditor?: boolean;
  type?: string;
  language?: string;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({
  code,
  showEditor = false,
  type = 'application/vnd.react',
  language,
}) => {
  const processedCode = useMemo(() => updateShadcnImports(code), [code]);

  const sandpackFiles = useMemo(() => {
    const filename = getArtifactFilename(type, language);
    return {
      [filename]: processedCode,
      ...sharedFiles,
    };
  }, [processedCode, type, language]);

  const template = useMemo(() => 
    getTemplate(type, language), 
    [type, language]
  );

  const customSetup = useMemo(() => ({
    dependencies: getDependencies(type)
  }), [type]);

  if (showEditor) {
    return (
      <Sandpack
        options={{
          showNavigator: true,
          editorHeight: "80vh",
          showTabs: true,
          ...sharedOptions,
        }}
        files={sandpackFiles}
        template={template}
        theme={dracula}
        customSetup={customSetup}
      />
    );
  }

  return (
    <SandpackProvider
      files={sandpackFiles}
      template={template}
      theme={dracula}
      customSetup={customSetup}
      options={sharedOptions}
    >
      <SandpackPreview 
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '1rem'
        }}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />
    </SandpackProvider>
  );
};

export default CodeRenderer;
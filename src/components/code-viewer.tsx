import React, { lazy, Suspense } from 'react';
import { sandpackDark } from "@codesandbox/sandpack-themes";
import type { SandpackFiles } from "@codesandbox/sandpack-react";

// Lazy load Sandpack components
const Sandpack = lazy(() => import("@codesandbox/sandpack-react").then(mod => ({ default: mod.Sandpack })));
const SandpackProvider = lazy(() => 
  import("@codesandbox/sandpack-react/unstyled").then(mod => ({ default: mod.SandpackProvider }))
);
const SandpackPreview = lazy(() => 
  import("@codesandbox/sandpack-react/unstyled").then(mod => ({ default: mod.SandpackPreview }))
);

interface CodeViewerProps {
  code: string;
  showEditor?: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  showEditor = false,
}) => {
  const sharedProps = {
    template: "react-ts" as const,
    theme: sandpackDark,
    customSetup: {
      dependencies: {
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "lucide-react": "latest",
        "recharts": "2.9.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "tailwindcss": "^3.3.0",
        "postcss": "^8.4.31",
        "autoprefixer": "^10.4.16"
      },
      files: {
        "/tailwind.config.js": `
          /** @type {import('tailwindcss').Config} */
          module.exports = {
            content: [
              "./src/**/*.{js,ts,jsx,tsx}",
            ],
            theme: {
              extend: {},
            },
            plugins: [],
          }
        `,
        "/postcss.config.js": `
          module.exports = {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }
        `,
        "/src/styles.css": `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
        `,
      }
    },
  };

  // Files that will be included in every preview
  const commonFiles = {
    "/src/index.tsx": `
      import { StrictMode } from "react";
      import { createRoot } from "react-dom/client";
      import "./styles.css";
      import App from "./App";

      const rootElement = document.getElementById("root");
      const root = createRoot(rootElement);

      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    `,
    "/src/App.tsx": code,
  };

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading code editor...</div>}>
      {showEditor ? (
        <Sandpack
          options={{
            showNavigator: true,
            editorHeight: "80vh",
            showTabs: true,
            visibleFiles: ["/src/App.tsx"],
          }}
          files={commonFiles}
          {...sharedProps}
        />
      ) : (
        <SandpackProvider
          files={commonFiles}
          className="flex h-full w-full grow flex-col justify-center"
          {...sharedProps}
        >
          <SandpackPreview
            className="flex h-full w-full grow flex-col justify-center p-4 md:pt-16"
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
          />
        </SandpackProvider>
      )}
    </Suspense>
  );
};

export default CodeViewer;

import React from 'react';
import { Sandpack, SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import { dracula } from '@codesandbox/sandpack-themes';
import * as shadcnComponents from "../utils/shadcn";
import dedent from "dedent";

// At the top of the file, add this interface
interface CodeRendererProps {
  code: string;
  showEditor?: boolean;
}

// Update the component definition
const CodeRenderer: React.FC<CodeRendererProps> = ({ code, showEditor = false }) => {
  // Shared configuration for both editor and preview modes
  const sharedConfig = {
    template: "react-ts" as const,
    theme: dracula,
    customSetup: {
      dependencies: {
        "lucide-react": "latest",
        "recharts": "2.9.0",
        "react-router-dom": "latest",
        "@radix-ui/react-dialog": "^1.1.1",
        "@radix-ui/react-slot": "^1.1.0",
        "class-variance-authority": "^0.7.0",
        "clsx": "^2.1.1",
        "tailwind-merge": "^2.4.0"
      }
    },
    options: {
      externalResources: [
        "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css"
      ]
    }
  };

  // Shared files that will be available in the sandbox
  const sharedFiles = {
    "/lib/utils.ts": shadcnComponents.utils,
    "/components/ui/accordion.tsx": shadcnComponents.accordian,
    "/components/ui/alert-dialog.tsx": shadcnComponents.alertDialog,
    "/components/ui/alert.tsx": shadcnComponents.alert,
    "/components/ui/avatar.tsx": shadcnComponents.avatar,
    "/components/ui/badge.tsx": shadcnComponents.badge,
    "/components/ui/breadcrumb.tsx": shadcnComponents.breadcrumb,
    "/components/ui/button.tsx": shadcnComponents.button,
    "/components/ui/calendar.tsx": shadcnComponents.calendar,
    "/components/ui/card.tsx": shadcnComponents.card,
    "/components/ui/carousel.tsx": shadcnComponents.carousel,
    "/components/ui/checkbox.tsx": shadcnComponents.checkbox,
    "/components/ui/collapsible.tsx": shadcnComponents.collapsible,
    "/components/ui/dialog.tsx": shadcnComponents.dialog,
    "/components/ui/drawer.tsx": shadcnComponents.drawer,
    "/components/ui/dropdown-menu.tsx": shadcnComponents.dropdownMenu,
    "/components/ui/input.tsx": shadcnComponents.input,
    "/components/ui/label.tsx": shadcnComponents.label,
    "/components/ui/menubar.tsx": shadcnComponents.menuBar,
    "/components/ui/navigation-menu.tsx": shadcnComponents.navigationMenu,
    "/components/ui/pagination.tsx": shadcnComponents.pagination,
    "/components/ui/popover.tsx": shadcnComponents.popover,
    "/components/ui/progress.tsx": shadcnComponents.progress,
    "/components/ui/radio-group.tsx": shadcnComponents.radioGroup,
    "/components/ui/select.tsx": shadcnComponents.select,
    "/components/ui/separator.tsx": shadcnComponents.separator,
    "/components/ui/skeleton.tsx": shadcnComponents.skeleton,
    "/components/ui/slider.tsx": shadcnComponents.slider,
    "/components/ui/switch.tsx": shadcnComponents.switchComponent,
    "/components/ui/table.tsx": shadcnComponents.table,
    "/components/ui/tabs.tsx": shadcnComponents.tabs,
    "/components/ui/textarea.tsx": shadcnComponents.textarea,
    "/components/ui/toast.tsx": shadcnComponents.toast,
    "/components/ui/toaster.tsx": shadcnComponents.toaster,
    "/components/ui/toggle-group.tsx": shadcnComponents.toggleGroup,
    "/components/ui/toggle.tsx": shadcnComponents.toggle,
    "/components/ui/tooltip.tsx": shadcnComponents.tooltip,
    "/components/ui/use-toast.tsx": shadcnComponents.useToast,
    "/public/index.html": dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `,
  };

  // If showEditor is true, render full Sandpack editor
  if (showEditor) {
    return (
      <Sandpack
        options={{
          showNavigator: true,
          editorHeight: "80vh",
          showTabs: false,
          ...sharedConfig.options
        }}
        files={{
          "/App.tsx": code,
          ...sharedFiles
        }}
        template={sharedConfig.template}
        theme={sharedConfig.theme}
        customSetup={sharedConfig.customSetup}
      />
    );
  }

  // Otherwise render just the preview
  return (
    <SandpackProvider
      files={{
        "/App.tsx": code,
        ...sharedFiles
      }}
      template={sharedConfig.template}
      theme={sharedConfig.theme}
      customSetup={sharedConfig.customSetup}
      options={sharedConfig.options}
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
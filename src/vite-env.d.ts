/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare var process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  }
};

declare module '*.ttf';
declare module '*.woff2';
declare module '*.woff';

declare module '*.png' {
  const fileName: string;
  export = fileName;
}

declare module '*.jpg' {
  const fileName: string;
  export = fileName;
}

declare module '*.jpeg' {
  const fileName: string;
  export = fileName;
}

declare module '*.svg' {
  const fileName: string;
  export = fileName;
}

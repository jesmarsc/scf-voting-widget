import { styled as styledImport, css as cssImport } from 'goober';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module 'preact' {
  namespace JSX {
    interface HTMLAttributes {
      tw?: string;
      css?: CSSProp;
    }

    interface IntrinsicAttributes {
      tw?: string;
      css?: CSSProp;
    }
  }
}

declare module '*.css' {
  const mapping: Record<string, string>;
  export default mapping;
}

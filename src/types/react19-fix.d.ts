// React 19 type compatibility fix
import * as React from 'react';

declare module 'react' {
  // Override ReactNode to fix compatibility with component libraries
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | Iterable<ReactNode>
    | React.ReactPortal
    | boolean
    | null
    | undefined
    | Promise<React.ReactNode>;
    
  // Fix ReactPortal type
  interface ReactPortal extends React.ReactElement {
    key: React.Key | null;
    children?: React.ReactNode;
  }
}

// Add missing type exports
export {};
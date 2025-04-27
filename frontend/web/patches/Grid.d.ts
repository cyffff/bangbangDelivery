import * as React from 'react';

// Define the full GridProps interface to match MUI's Grid
export interface GridProps {
  // Basic props
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
  style?: React.CSSProperties;
  
  // Main Grid props
  container?: boolean;
  item?: boolean;
  
  // Spacing props
  spacing?: number | string;
  rowSpacing?: number | string;
  columnSpacing?: number | string;
  
  // Responsive size props
  xs?: boolean | 'auto' | number;
  sm?: boolean | 'auto' | number;
  md?: boolean | 'auto' | number;
  lg?: boolean | 'auto' | number;
  xl?: boolean | 'auto' | number;
  
  // Layout props
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'space-between' | 'space-around';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  
  // Additional styling
  sx?: React.CSSProperties | Record<string, any>;
  
  // MUI pass-through props
  zeroMinWidth?: boolean;
  
  // Allow any other props to be passed
  [key: string]: any;
}

// Define the Grid component with proper typing
declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;

export default Grid; 
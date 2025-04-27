import React from 'react';

// Create a Grid component that mimics MUI Grid API
const Grid = (props) => {
  const {
    item,
    container,
    spacing,
    xs,
    sm,
    md,
    lg,
    xl,
    direction,
    justifyContent,
    alignItems,
    component,
    sx,
    children,
    ...rest
  } = props;
  
  // Apply the minimum necessary styles to make it look like a grid
  const style = {
    display: 'flex',
    flexDirection: container ? 'row' : 'column',
    flexWrap: container ? 'wrap' : 'nowrap',
    width: '100%',
    ...(sx || {})
  };
  
  return (
    <div style={style} {...rest}>
      {children}
    </div>
  );
};

export { Grid };
export default Grid; 
import React from 'react';

/**
 * This is a Grid component that works as a drop-in replacement for Material-UI's Grid
 * It fixes the TypeScript errors by implementing the expected props interface
 */
const Grid = React.forwardRef(function Grid(props, ref) {
  const {
    children,
    className = '',
    component: Component = 'div',
    container = false,
    item = false,
    spacing = 0,
    rowSpacing,
    columnSpacing,
    xs,
    sm,
    md,
    lg,
    xl,
    direction = 'row',
    justifyContent,
    alignItems,
    alignContent,
    wrap = 'wrap',
    sx = {},
    ...other
  } = props;

  // Build inline styles based on props
  const styles = {
    boxSizing: 'border-box',
    ...(container && {
      display: 'flex',
      flexWrap: wrap,
      flexDirection: direction,
      justifyContent,
      alignItems,
      alignContent,
      ...(Number(spacing) > 0 && {
        margin: -Number(spacing) * 4 + 'px',
      }),
      ...(rowSpacing !== undefined && {
        marginTop: -Number(rowSpacing) * 4 + 'px',
        marginBottom: -Number(rowSpacing) * 4 + 'px',
      }),
      ...(columnSpacing !== undefined && {
        marginLeft: -Number(columnSpacing) * 4 + 'px',
        marginRight: -Number(columnSpacing) * 4 + 'px',
      }),
    }),
    ...(item && {
      ...(Number(spacing) > 0 && {
        padding: Number(spacing) * 4 + 'px',
      }),
      ...(rowSpacing !== undefined && {
        paddingTop: Number(rowSpacing) * 4 + 'px',
        paddingBottom: Number(rowSpacing) * 4 + 'px',
      }),
      ...(columnSpacing !== undefined && {
        paddingLeft: Number(columnSpacing) * 4 + 'px',
        paddingRight: Number(columnSpacing) * 4 + 'px',
      }),
      ...(xs !== undefined && {
        flexGrow: xs === true ? 1 : 0,
        flexBasis: xs === true ? 0 : typeof xs === 'number' ? `${(xs / 12) * 100}%` : 'auto',
        maxWidth: typeof xs === 'number' ? `${(xs / 12) * 100}%` : 'none',
      }),
      ...(sm !== undefined && {
        '@media (min-width:600px)': {
          flexGrow: sm === true ? 1 : 0,
          flexBasis: sm === true ? 0 : typeof sm === 'number' ? `${(sm / 12) * 100}%` : 'auto',
          maxWidth: typeof sm === 'number' ? `${(sm / 12) * 100}%` : 'none',
        },
      }),
      ...(md !== undefined && {
        '@media (min-width:900px)': {
          flexGrow: md === true ? 1 : 0,
          flexBasis: md === true ? 0 : typeof md === 'number' ? `${(md / 12) * 100}%` : 'auto',
          maxWidth: typeof md === 'number' ? `${(md / 12) * 100}%` : 'none',
        },
      }),
      ...(lg !== undefined && {
        '@media (min-width:1200px)': {
          flexGrow: lg === true ? 1 : 0,
          flexBasis: lg === true ? 0 : typeof lg === 'number' ? `${(lg / 12) * 100}%` : 'auto',
          maxWidth: typeof lg === 'number' ? `${(lg / 12) * 100}%` : 'none',
        },
      }),
      ...(xl !== undefined && {
        '@media (min-width:1536px)': {
          flexGrow: xl === true ? 1 : 0,
          flexBasis: xl === true ? 0 : typeof xl === 'number' ? `${(xl / 12) * 100}%` : 'auto',
          maxWidth: typeof xl === 'number' ? `${(xl / 12) * 100}%` : 'none',
        },
      }),
    }),
    ...sx,
  };

  return (
    <Component ref={ref} className={className} style={styles} {...other}>
      {children}
    </Component>
  );
});

Grid.displayName = 'Grid';

export default Grid; 
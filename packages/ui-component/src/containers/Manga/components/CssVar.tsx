import { memo } from 'react';
import { useStore } from '../hooks/useStore';
import classes from '../index.module.css';

export const CssVar: React.FC = memo(() => {
  const cssVar = useStore((state) => state.cssVar);

  return (
    <style type="text/css">{`
    .${classes.root} {
      ${Object.entries(cssVar)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n')}
      }
    `}</style>
  );
});

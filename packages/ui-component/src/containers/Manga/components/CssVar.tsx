import { memo } from 'react';
import { useStore } from '../hooks/useStore';

export const CssVar: React.FC = memo(() => {
  const cssVar = useStore((state) => state.cssVar);

  return (
    <style type="text/css">{`
    :root {
      ${Object.entries(cssVar)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n')}
      }
    `}</style>
  );
});

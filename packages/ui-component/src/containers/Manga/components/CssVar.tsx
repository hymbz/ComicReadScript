import { shallow, useStore } from '../hooks/useStore';

const selector = ({ cssVar }: SelfState) => ({
  cssVar,
});

export const CssVar: React.FC = () => {
  const { cssVar } = useStore(selector, shallow);

  return (
    <style type="text/css">{`
    :root {
      ${Object.entries(cssVar)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n')}
      }
    `}</style>
  );
};

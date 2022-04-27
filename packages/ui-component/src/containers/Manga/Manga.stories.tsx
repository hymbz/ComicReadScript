import root from 'react-shadow';
import component from '.';

export default {
  title: 'Base',
};

const { Manga, css } = component();
export const Base = () => (
  <root.div className="quote">
    <q>There is strong shadow where there is much light.</q>
    <Manga />
    <span className="author">― Johann Wolfgang von Goethe.</span>
    <style type="text/css">{css}</style>
  </root.div>
);

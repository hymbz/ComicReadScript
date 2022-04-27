import ReactDOM from 'react-dom/client';
import component from '.';

const Manga = component();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Manga />);

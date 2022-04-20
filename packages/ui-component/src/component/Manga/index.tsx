import { useState, useRef } from 'react';

export default () => {
  console.log('import Manga');

  const Manga: React.FC = () => {
    const [open, setOpen] = useState(false);

    const ref = useRef() as React.MutableRefObject<HTMLButtonElement>;
    // const arrowRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [arrowRef, setArrowRef] =
      useState<React.MutableRefObject<HTMLDivElement> | null>(null);

    return (
      <>
        <div className="py-8">Manga</div>
        <div>Manga</div>
      </>
    );
  };

  return Manga;
};

import { getLib } from '../../helper/import';

export default async () => {
  const React = await getLib.React();
  const { useRef, useState } = await getLib.React();

  console.log('import Manga');

  const Manga: React.FC = () => {
    const [open, setOpen] = useState(false);

    const ref = useRef() as React.MutableRefObject<HTMLButtonElement>;
    // const arrowRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [arrowRef, setArrowRef] =
      useState<React.MutableRefObject<HTMLDivElement> | null>(null);

    return (
      <>
        <div>Manga</div>
        <div>Manga</div>
      </>
    );
  };

  return Manga;
};

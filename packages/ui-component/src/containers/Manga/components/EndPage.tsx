import clsx from 'clsx';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

export const EndPage: React.FC = () => {
  const showEndPage = useStore((state) => state.showEndPage);

  return (
    <div className={clsx(classes.endPage)} data-show={showEndPage}>
      <p>END</p>
    </div>
  );
};

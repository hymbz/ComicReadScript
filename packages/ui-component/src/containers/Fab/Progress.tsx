import classes from './index.module.css';

export interface ProgressProps {
  /** 百分比进度值，小数 */
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <span className={classes.progress} role="progressbar" aria-valuenow={value}>
      <svg
        viewBox="22 22 44 44"
        style={{ strokeDashoffset: `${(1 - value) * 290}%` }}
      >
        <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" />
      </svg>
    </span>
  );
};

import classes from './index.module.css';

const a = [1, 2];
const b = [...a, 3];

/** 测试按钮 */
export const Button: React.FC = () => {
  return (
    <>
      <div className={classes.red}>Button</div>
      <div>{b}</div>
    </>
  );
};

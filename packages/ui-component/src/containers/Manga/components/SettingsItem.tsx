import clsx from 'clsx';
import classes from '../index.module.css';

export interface SettingsItemProps {
  name: string;
  className?: string;

  children: JSX.Element | JSX.Element[];
}

/**
 * 设置菜单项
 */
export const SettingsItem: React.FC<SettingsItemProps> = ({
  name,
  className,
  children,
}) => (
  <div className={clsx(classes.SettingsItem, className?.length && className)}>
    <div className={classes.SettingsItemName}> {name} </div>
    {children}
  </div>
);

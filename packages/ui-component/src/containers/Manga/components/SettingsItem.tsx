import classes from '../index.module.css';

export interface SettingsItemProps {
  name: string;

  children: JSX.Element | JSX.Element[];
}

/**
 * 设置菜单项
 *
 * @param param param
 */
export const SettingsItem: React.FC<SettingsItemProps> = ({
  name,
  children,
}) => (
  <div className={classes.SettingsItem}>
    <div className={classes.SettingsItemName}> {name} </div>
    {children}
  </div>
);

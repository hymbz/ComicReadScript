export interface SettingsItemProps {
  name: string;

  children: JSX.Element[];
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  name,
  children,
}) => {
  return (
    <div className="flex mt-1em items-center justify-between">
      <div className="text-.9em"> {name} </div>

      {children}

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </div>
  );
};

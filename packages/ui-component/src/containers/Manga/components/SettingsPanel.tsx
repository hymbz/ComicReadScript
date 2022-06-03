// import { Card, css, Divider } from '@mui/material';
// import { useSettingsList } from '../hooks/useSettingsList';
// import { SettingsPanelList } from './SettingsPanelList';

// /** 设置面板 */
// export const SettingPanel: React.FC = () => {
//   const SettingsList = useSettingsList();

//   return (
//     <Card css={css({ width: '15em' })} elevation={3}>
//       {SettingsList.reduce((prev, settingkey, i) => {
//         if (i !== 0) prev.push(<Divider key={`Divider-${settingkey}`} />);
//         prev.push(
//           <SettingsPanelList key={settingkey} settingkey={settingkey} />,
//         );
//         return prev;
//       }, [] as JSX.Element[])}
//     </Card>
//   );
// };

export {};

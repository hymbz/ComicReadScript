// import {
//   List,
//   ListSubheader,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Switch,
//   Input,
// } from '@mui/material';
// import type { CSSProperties } from 'react';
// import { useMemo } from 'react';
// import { isElement } from '../../../helper';

// import { useStore } from '../hooks/useStore';

// export interface SettingsPanelListProps {
//   settingkey: string;
// }

// const colorStyle: CSSProperties = {
//   width: '2em',
//   marginRight: '.3em',
// };

// const selector = (state: SelfState) => state.settingsMap;

// export const SettingsPanelList: React.FC<SettingsPanelListProps> = ({
//   settingkey,
// }) => {
//   const settingsMap = useStore(selector);
//   const settingsList = settingsMap.get(settingkey)!;

//   const subheaderEle = useMemo(
//     () => <ListSubheader>{settingkey}</ListSubheader>,
//     [settingkey],
//   );

//   const settingsListEle = useMemo(() => {
//     let hiddenOtherIndex: number | undefined;
//     return settingsList
//       .map((settingItem, i) => {
//         if (!settingItem) return undefined;

//         if (settingItem.type === 'switch') {
//           const { hiddenOther } = settingItem;
//           // 每个开关的 hiddenOther 只影响自己的范围
//           // 如果后面出现其他带 hiddenOther 的开关，按其设置生效
//           if (hiddenOther === false && hiddenOtherIndex) {
//             hiddenOtherIndex = undefined;
//           } else if (hiddenOther) {
//             hiddenOtherIndex = i;
//           }
//         }
//         if (hiddenOtherIndex && i > hiddenOtherIndex) return undefined;

//         switch (settingItem.type) {
//           case 'switch': {
//             const { name, checked, onChange } = settingItem;
//             const id = `manga-settings-List-Item-${name}`;
//             return (
//               <ListItem key={name}>
//                 <ListItemText primary={name} id={id} />
//                 <ListItemSecondaryAction>
//                   <Switch
//                     edge="end"
//                     onChange={onChange}
//                     checked={checked}
//                     inputProps={{
//                       'aria-labelledby': id,
//                     }}
//                   />
//                 </ListItemSecondaryAction>
//               </ListItem>
//             );
//           }
//           case 'color': {
//             const { name, value, onChange } = settingItem;
//             const id = `manga-settings-List-Item-${name}`;
//             return (
//               <ListItem key={name}>
//                 <ListItemText primary={name} id={id} />
//                 <ListItemSecondaryAction>
//                   <Input
//                     type="color"
//                     style={colorStyle}
//                     value={value}
//                     onChange={onChange}
//                   />
//                 </ListItemSecondaryAction>
//               </ListItem>
//             );
//           }

//           default:
//             return undefined;
//         }
//       })
//       .filter<JSX.Element>(isElement);
//   }, [settingsList]);

//   return <List subheader={subheaderEle}>{settingsListEle}</List>;
// };

export {};

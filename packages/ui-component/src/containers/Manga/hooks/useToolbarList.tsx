// import { useEffect } from 'react';

// import SettingsIcon from '@mui/icons-material/Settings';
// import Filter1Icon from '@mui/icons-material/Filter1';
// import ViewDayIcon from '@mui/icons-material/ViewDay';
// import QueueIcon from '@mui/icons-material/Queue';

// import { castDraft } from 'immer';
// import { useStore } from './useStore';
// import { SettingPanel } from '../components/SettingsPanel';

// const defaultButtonList: InitButtonData[] = [
//   {
//     key: '单页模式',
//     icon: <Filter1Icon />,
//     enable: (state) => state.option.单页模式,
//     handleCLick: (set, get) => {
//       let newSlideIndex: number;

//       set((draftState) => {
//         draftState.option.单页模式 = !draftState.option.单页模式;

//         const { activeImgIndex } = draftState;

//         draftState.img.updateSlideData(draftState);

//         newSlideIndex = draftState.option.单页模式
//           ? activeImgIndex
//           : draftState.slideData.findIndex((slide) =>
//               slide.some((img) => img.index === activeImgIndex),
//             );
//         draftState.activeSlideIndex = newSlideIndex;
//       });

//       setTimeout(() => {
//         const { swiper } = get();
//         swiper.slideTo(newSlideIndex, 0);
//         swiper.update();
//       }, 0);
//     },
//   },
//   {
//     key: '卷轴模式',
//     icon: <ViewDayIcon />,
//     enable: (state) => state.option.卷轴模式,
//     handleCLick: (set) => {
//       set((draftState) => {
//         draftState.option.卷轴模式 = !draftState.option.卷轴模式;

//         const enable = draftState.option.卷轴模式;
//         const [swiper, panzoom] = draftState.initSwiper({
//           // 启用自由模式
//           freeMode: enable,
//           // 使用自带的鼠标滚轮模块
//           mousewheel: enable ? { eventsTarget: '#manga-main' } : false,
//           // 设置重新初始化后的初始页面
//           initialSlide: draftState.activeSlideIndex,
//         });

//         draftState.swiper = castDraft(swiper);
//         draftState.panzoom = castDraft(panzoom);
//       });
//     },
//   },
//   {
//     key: '页面填充',
//     icon: <QueueIcon />,
//     enable: (state) => state.fillEffect.get(state.nowFillIndex)!,
//     hidden: (state) => state.option.单页模式,
//     handleCLick: (set) => {
//       set((draftState) => {
//         draftState.fillEffect.set(
//           draftState.nowFillIndex,
//           !draftState.fillEffect.get(draftState.nowFillIndex),
//         );
//         draftState.img.updateSlideData(draftState);
//       });
//     },
//   },
//   { dividers: true },
//   {
//     key: '设置',
//     icon: <SettingsIcon />,
//     enable: false,
//     handleCLick: () => (draftButton) => {
//       draftButton.poper!.open = !draftButton.poper!.open;
//     },
//     poper: {
//       id: 'manga-toolbar-button-setting',
//       open: false,
//       children: <SettingPanel />,
//     },
//   },
//   // 示例
//   //
//   // {
//   //   key: 'test',
//   //   icon: <DeleteIcon />,
//   //   enable: (state) => state.option.darkMode,
//   //   handleCLick: (draftButton, draftState) => {
//   //       // 这里的 draftButton, draftState 用于直接修改其中的内容
//   //       //
//   //       // 但因为这个函数是在 immer 内执行的，只有直接赋值修改能生效
//   //       // ```draftState.switchDarkMode();``` 不会生效
//   //     },
//   // },
// ];

// const selector = ({
//   //
//   buttonMap,
//   initToolbar,
// }: SelfState) => ({
//   buttonMap,
//   initToolbar,
// });

// /**
//  * 初始化工具栏按钮列表
//  *
//  * @param buttonList 工具栏按钮列表
//  * @returns buttonMap
//  */
// export const useToolbarList = (buttonList = defaultButtonList) => {
//   const { buttonMap, initToolbar } = useStore(selector);

//   useEffect(() => {
//     initToolbar(buttonList);
//   }, [initToolbar, buttonList]);

//   return [...buttonMap.keys()];
// };

export {};

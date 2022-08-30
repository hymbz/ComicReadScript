import { useMemo, useCallback, useState, Fragment } from 'react';
import {
  MdLooksOne,
  MdLooksTwo,
  MdViewDay,
  MdQueue,
  MdSettings,
} from 'react-icons/md';
import { useStore } from './hooks/useStore';
import { defaultSettingsList } from './defaultSettingList';
import { ToolbarButton } from './components/ToolbarButton';

export const defaultButtonList: [string, React.FC][] = [
  [
    '单页模式',
    () => {
      const isOnePageMode = useStore((state) => state.option.单页模式);
      const handleClick = useCallback(() => {
        let newSlideIndex: number;

        useStore.setState((draftState) => {
          draftState.option.单页模式 = !draftState.option.单页模式;

          const { activeImgIndex } = draftState;

          draftState.img.updateSlideData(draftState);

          newSlideIndex = draftState.option.单页模式
            ? activeImgIndex
            : draftState.slideData.findIndex((slide) =>
                slide.some((img) => img.index === activeImgIndex),
              );
          draftState.activeSlideIndex = newSlideIndex;
        });

        setTimeout(() => {
          const swiper = useStore((state) => state.swiper);
          if (!swiper) return;
          swiper.slideTo(newSlideIndex, 0);
          swiper.update();
        }, 0);
      }, []);

      return (
        <ToolbarButton buttonKey="单页模式" onClick={handleClick}>
          {isOnePageMode ? <MdLooksOne /> : <MdLooksTwo />}
        </ToolbarButton>
      );
    },
  ],
  [
    '卷轴模式',
    () => {
      const enable = useStore((state) => state.option.卷轴模式);

      const handleClick = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.option.卷轴模式 = !draftState.option.卷轴模式;

          const [swiper, panzoom] = draftState.initSwiper({
            // 启用自由模式
            freeMode: enable,
            // 使用自带的鼠标滚轮模块
            mousewheel: enable ? { eventsTarget: '#manga-main' } : false,
            // 设置重新初始化后的初始页面
            initialSlide: draftState.activeSlideIndex,
          });

          draftState.swiper = swiper;
          draftState.panzoom = panzoom;
        });
      }, [enable]);

      return (
        <ToolbarButton
          buttonKey="卷轴模式"
          enable={enable}
          onClick={handleClick}
        >
          <MdViewDay />
        </ToolbarButton>
      );
    },
  ],
  [
    '页面填充',
    () => {
      const enable = useStore(
        (state) => state.fillEffect.get(state.nowFillIndex)!,
      );
      const isOnePageMode = useStore((state) => state.option.单页模式);

      const handleClick = useCallback(() => {
        useStore.setState((draftState) => {
          draftState.fillEffect.set(
            draftState.nowFillIndex,
            !draftState.fillEffect.get(draftState.nowFillIndex),
          );
          draftState.img.updateSlideData(draftState);
        });
      }, []);

      return (
        <ToolbarButton
          buttonKey="页面填充"
          enable={enable}
          hidden={isOnePageMode}
          onClick={handleClick}
        >
          <MdQueue />
        </ToolbarButton>
      );
    },
  ],
  [
    '分隔',
    () => (
      <div className="h-1em">
        <style type="text/css">{`
          @unocss-placeholder;
        `}</style>
      </div>
    ),
  ],
  [
    '设置',
    () => {
      const [showPanel, setShowPanel] = useState(false);

      const handleClick = useCallback(() => {
        setShowPanel(!showPanel);
      }, [showPanel]);

      const popper = useMemo(
        () => (
          <div className="text-[var(--buttonColor)] bg-[var(--buttonHoverBgColor)] rounded-.3em card-shadow -translate-y-2/3">
            <div className="w-15em rounded-1 my-auto bg-[#353535] text-white">
              {defaultSettingsList.map(([key, SettingItem], i) => (
                <Fragment key={key}>
                  {i ? <hr /> : undefined}
                  <div className="p-.5em">
                    <div className="text-.7em mb-1em text-gray-300">{key}</div>
                    <SettingItem />
                  </div>
                </Fragment>
              ))}

              <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
            </div>

            <style type="text/css">{`
                @unocss-placeholder;
              `}</style>
          </div>
        ),
        [],
      );

      return (
        <ToolbarButton
          buttonKey="设置"
          enable={showPanel}
          showTip={showPanel}
          onClick={handleClick}
          popper={showPanel && popper}
        >
          <MdSettings />
        </ToolbarButton>
      );
    },
  ],
];

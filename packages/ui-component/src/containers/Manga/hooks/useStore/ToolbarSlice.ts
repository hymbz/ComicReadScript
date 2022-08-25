import { produce } from 'immer';

declare global {
  interface Poper {
    id: string;
    open: boolean;
    children: JSX.Element;
  }

  interface DividersButton {
    dividers: true;
  }

  interface Button {
    /** 图标 */
    icon: JSX.Element;
    /** aria-label属性 */
    ariaLabel: string;
    /** 是否启用 */
    enable: boolean;
    hiddenSelector: ((state: SelfState) => boolean) | (() => undefined);
    handleCLick: React.MouseEventHandler<HTMLElement>;
    handleClickAway: () => void;
    poper?: Poper;
  }

  type ButtonData = Button | DividersButton;

  interface InitButton {
    key: string;
    icon: JSX.Element;
    enable: boolean | ((state: DraftSelfState) => boolean);
    hidden?: (state: SelfState) => boolean;
    handleCLick: (
      set: SelfStateSet,
      get: SelfStateGet,
      event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => void | ((button: Button) => void);
    poper?: Poper;
  }

  type InitButtonData = InitButton | DividersButton;
}

export interface ToolbarSlice {
  buttonMap: Map<string, ButtonData>;

  initToolbar: (InitButtonList: InitButtonData[]) => void;

  [key: string]: unknown;
}

export const toolbarSlice: SelfStateCreator<ToolbarSlice> = (set, get) => ({
  buttonMap: new Map(),

  initToolbar: (InitButtonList: InitButtonData[]) => {
    let dividersNum = 0;
    set((state) => {
      InitButtonList.forEach((InitButtonData) => {
        if ('key' in InitButtonData) {
          const { key, icon, enable, hidden, handleCLick, poper } =
            InitButtonData;
          const newState: ButtonData = {
            icon,
            enable: typeof enable === 'function' ? enable(state) : enable,
            hiddenSelector: hidden ?? (() => undefined),
            ariaLabel: key,
            poper,

            handleCLick: (event) => {
              const Callback = handleCLick(set, get, event);
              set((draftState) => {
                draftState.buttonMap.set(
                  key,
                  produce(draftState.buttonMap.get(key)!, (draftButtonData) => {
                    if (typeof enable === 'function')
                      (draftButtonData as Button).enable = enable(draftState);
                    if (Callback) Callback(draftButtonData as Button);
                  }),
                );
              });
              event.stopPropagation();
            },

            // 在点击其他地方后关闭 poper
            handleClickAway: () => {
              const buttonData = get().buttonMap.get(key)!;
              if ('poper' in buttonData && buttonData.poper!.open) {
                set((draftState) => {
                  draftState.buttonMap.set(
                    key,
                    produce(buttonData, (draftButtonData) => {
                      draftButtonData.poper!.open = false;
                    }),
                  );
                });
              }
            },
          };
          state.buttonMap.set(key, newState);
        } else {
          state.buttonMap.set(`dividers-${dividersNum}`, InitButtonData);
          dividersNum += 1;
        }
      });
    });
  },
});

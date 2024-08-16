type EscHandler = Array<{ (): true | unknown; order: number }>;
export const escHandler: EscHandler = [];

export const setEscHandler = (order: number, handler: () => true | unknown) => {
  escHandler.push(Object.assign(handler, { order }));
  escHandler.sort((a, b) => b.order - a.order);
};

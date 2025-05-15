import { createContext, FC, useEffect, useMemo, useRef, PropsWithChildren } from 'react';

const def = {
  mutableAttributes: {},
  id: '',
  type: '',
};

export const DragAndCropContext = createContext<any>(def);

export const DNDContext: FC<PropsWithChildren> = (props) => {
  const ref = useRef(1);

  const genId = () => {
    if (ref.current && typeof ref.current === 'number') {
      return ++ref.current;
    }
  };

  return <DragAndCropContext.Provider value={{ genId }}>{props.children}</DragAndCropContext.Provider>;
};

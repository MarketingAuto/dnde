import { createContext, FC, memo, useContext, useEffect, useRef, useState, PropsWithChildren, ReactNode } from 'react';
import { logger } from '../Utils/logger';

export const HtmlContext = createContext<any>(null);

export const HtmlContextProvider: FC<PropsWithChildren> = memo((props) => {
  const [activeHover, setActiveHover] = useState<any>();

  const [active, setActive] = useState<any>();

  const ref = useRef<any>(1);

  const [id, setId] = useState<any>(1);

  const getId = () => {
    setId(id + 1);
    logger.log('getId', id);
  };

  useEffect(() => {
    logger.log('uiContextRerendering', ref.current++);
  });

  return (
    <HtmlContext.Provider
      value={{
        activeHover,
        setActiveHover,
        active,
        setActive,
        id,
        setId,
        getId,
      }}
    >
      {props.children}
    </HtmlContext.Provider>
  );
});

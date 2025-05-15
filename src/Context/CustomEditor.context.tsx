import { createContext, FC, useRef, useState, PropsWithChildren } from 'react';

export const CustomEditorContext = createContext<{
  position: { x: number; y: number; setX: (x: number) => void; setY: (y: number) => void };
  status: { active: boolean; setActive: (active: boolean) => void };
}>({
  position: { x: 0, y: 0, setX: () => {}, setY: () => {} },
  status: { active: false, setActive: () => {} },
});

export const CustomEditor: FC<PropsWithChildren> = (props) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [active, setActive] = useState(false);

  return (
    <CustomEditorContext.Provider value={{ position: { x, y, setX, setY }, status: { active, setActive } }}>
      {props.children}
    </CustomEditorContext.Provider>
  );
};

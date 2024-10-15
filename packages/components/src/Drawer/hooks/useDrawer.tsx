import { useState, ReactNode } from 'react';
import { Drawer } from 'antd';

interface UseDrawerProps {
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number;
  height?: number;
}

interface DrawerState {
  visible: boolean;
  content: ReactNode | null;
}

export const useDrawer = ({
  title = 'Drawer',
  placement = 'right',
  width = 378,
  height = 378,
}: UseDrawerProps = {}) => {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    visible: false,
    content: null,
  });

  const showDrawer = (content: ReactNode) => {
    setDrawerState({ visible: true, content });
  };

  const closeDrawer = () => {
    setDrawerState((prevState) => ({ ...prevState, visible: false }));
  };

  const DrawerComponent = () => (
    <Drawer
      title={title}
      placement={placement}
      width={placement === 'left' || placement === 'right' ? width : undefined}
      height={placement === 'top' || placement === 'bottom' ? height : undefined}
      onClose={closeDrawer}
      open={drawerState.visible}
    >
      {drawerState.content}
    </Drawer>
  );

  return {
    showDrawer,
    closeDrawer,
    DrawerComponent,
  };
};

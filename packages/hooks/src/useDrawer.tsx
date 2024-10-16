import { useState, ReactNode } from 'react';
import { Button, Drawer, Space } from 'antd';

interface UseDrawerProps {
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number;
  height?: number;
}

interface DrawerState {
  title: string;
  visible: boolean;
  content: ReactNode | null;
}

export const useDrawer = ({
  placement = 'right',
  width = 378,
  height = 378,
}: UseDrawerProps = {}) => {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    title: '信息',
    visible: false,
    content: null,
  });

  const showDrawer = (options: { title: string, content: ReactNode }) => {
    setDrawerState({ visible: true, ...options });
  };

  const closeDrawer = () => {
    setDrawerState((prevState) => ({ ...prevState, visible: false }));
  };

  const DrawerComponent = () => {

    function handleSave() {
      console.log('save')
    }

    return <Drawer
      title={drawerState.title}
      placement={placement}
      width={placement === 'left' || placement === 'right' ? width : undefined}
      height={placement === 'top' || placement === 'bottom' ? height : undefined}
      onClose={closeDrawer}
      open={drawerState.visible}
      footer={
        <Space className='justify-end w-full'>
          <Button color="default" variant="outlined" onClick={closeDrawer}>
            关闭
          </Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      {drawerState.content}
    </Drawer>
  };

  return {
    showDrawer,
    closeDrawer,
    DrawerComponent,
  };
};

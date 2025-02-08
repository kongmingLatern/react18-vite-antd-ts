import { theme, type ThemeConfig } from 'antd'

// 默认主题 - 蓝色科技风格
export const defaultTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 品牌主色 - 深紫色主题
    colorPrimary: '#722ED1', // 深紫色

    // 功能色
    colorSuccess: '#52c41a', // 成功色
    colorWarning: '#faad14', // 警告色
    colorError: '#ff4d4f', // 错误色
    colorInfo: '#722ED1', // 信息色

    // 中性色
    colorTextBase: 'rgba(0, 0, 0, 0.88)', // 主要文本色
    colorBgBase: '#ffffff', // 背景色
    colorBorder: '#d9d9d9', // 边框色

    // 派生变量
    borderRadius: 6, // 圆角
    wireframe: false, // 线框风格
  },
}

// 暗色主题
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#4096ff', // 使用更淡的蓝色
    colorBgBase: '#141414', // 使用深灰色而不是纯黑
    colorTextBase: 'rgba(255, 255, 255, 0.85)',
    colorBorder: '#636363', // 使用更淡的边框色
  },
}

// 科技蓝主题
export const techBlueTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff', // Daybreak Blue 拂晓蓝
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1677ff',
    colorBgBase: '#ffffff',
    colorBorder: '#e6e6e6',
  },
}

// 商务绿主题
export const businessGreenTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#52c41a',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#52c41a',
    colorBgBase: '#ffffff',
    colorBorder: '#e6e6e6',
  },
}

// 珊瑚粉主题
export const coralTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#FF7875', // 珊瑚粉
    colorSuccess: '#95DE64',
    colorWarning: '#FFB37B',
    colorError: '#FF4D4F',
    colorInfo: '#FF7875',
    colorBgBase: '#ffffff',
    colorBorder: '#FFE7E7',
  },
}

// 橙金主题
export const goldenTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#FA8C16', // 金橙色
    colorSuccess: '#52c41a',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorInfo: '#FA8C16',
    colorBgBase: '#ffffff',
    colorBorder: '#FFE7BA',
  },
}

// 青碧主题
export const cyanTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#13C2C2', // 青碧色
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#13C2C2',
    colorBgBase: '#ffffff',
    colorBorder: '#B5F5EC',
  },
}

export const themes = {
  default: {
    key: 'default',
    label: '默认主题',
    theme: defaultTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1677ff' }} />,
  },
  dark: {
    key: 'dark',
    label: '暗色主题',
    theme: darkTheme,
    icon: (
      <span style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#151515',
      }}
      />
    ),
  },
  techBlueTheme: {
    key: 'techBlueTheme',
    label: '科技蓝主题',
    theme: techBlueTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1890ff' }} />,
  },
  businessGreenTheme: {
    key: 'businessGreenTheme',
    label: '商务绿主题',
    theme: businessGreenTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52c41a' }} />,
  },
  coral: {
    key: 'coral',
    label: '珊瑚粉主题',
    theme: coralTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FF7875' }} />,
  },
  golden: {
    key: 'golden',
    label: '橙金主题',
    theme: goldenTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FA8C16' }} />,
  },
  cyan: {
    key: 'cyan',
    label: '青碧主题',
    theme: cyanTheme,
    icon: <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#13C2C2' }} />,
  },

}

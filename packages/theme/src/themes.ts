import { theme, type ThemeConfig } from 'antd'

// 默认主题 - 蓝色科技风格
export const defaultTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 品牌主色
    colorPrimary: '#1677ff', // Daybreak Blue 拂晓蓝

    // 功能色
    colorSuccess: '#52c41a', // 成功色
    colorWarning: '#faad14', // 警告色
    colorError: '#ff4d4f', // 错误色
    colorInfo: '#1677ff', // 信息色

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
    colorPrimary: '#1668dc',
    colorBgBase: '#000000',
    colorTextBase: 'rgba(255, 255, 255, 0.85)',
    colorBorder: '#424242',
  },
}

// 科技蓝主题
export const techBlueTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
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
  },
}

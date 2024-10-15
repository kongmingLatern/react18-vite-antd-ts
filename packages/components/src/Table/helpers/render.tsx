import { formatDate } from "@react18-vite-antd-ts/utils"

export const renderTimeColumns = (time: string | number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return formatDate(time, format)
}
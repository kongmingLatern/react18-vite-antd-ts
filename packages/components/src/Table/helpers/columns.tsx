import { renderCurrencyColumn, renderNestedColumn, renderTimeColumns } from "./render"
import { ColumnPropsWithFormatTime, COLUMNTYPE } from "../types"
import { getNestedValue } from "@react18-vite-antd-ts/utils"

function isNestedKey(key: string) {
  return key.split('.')?.length > 1
}

// 如果设置type为time，就自动格式化时间
function isTimeColumn(column: ColumnPropsWithFormatTime) {
  return column.type === COLUMNTYPE.TIME
}

// 这里封装一些通用展示的列
export function createColumns(props: {
  columns: ColumnPropsWithFormatTime[]
}) {
  return props.columns?.map((column) => {
    const processedColumn = { ...column, dataIndex: column.key };

    if (isNestedKey(column.key as string)) {
      processedColumn.render = column.render || ((_, record, index) => {
        const targetValue = getNestedValue(record, column.key);
        return renderNestedColumn(targetValue, { column, record, index });
      });
    }

    if (isTimeColumn(column)) {
      processedColumn.render = (text: string) => renderTimeColumns(text, column.formatTime);
    }

    return processedColumn;
  });
}

// 添加新的列类型处理函数
type ColumnProcessor = (column: ColumnPropsWithFormatTime) => Partial<ColumnPropsWithFormatTime>;

const columnProcessors: Record<string, ColumnProcessor> = {
  [COLUMNTYPE.TIME]: (column) => ({
    render: (text: string) => renderTimeColumns(text, column.formatTime),
  }),
  [COLUMNTYPE.CURRENCY]: (column) => ({
    render: (text: number) => renderCurrencyColumn(text, column.formatTime),
  }),
};

// 扩展性更强的列创建函数
export function createExtensibleColumns(props: {
  columns: ColumnPropsWithFormatTime[]
  customProcessors?: Record<string, ColumnProcessor>
}) {
  const { columns, customProcessors = {} } = props;
  const allProcessors = { ...columnProcessors, ...customProcessors };

  return columns?.map((column) => {
    let processedColumn = { ...column, dataIndex: column.key };

    if (isNestedKey(column.key as string) && !column.render) {
      processedColumn.render = (_, record, index) => {
        const targetValue = getNestedValue(record, column.key);
        return renderNestedColumn(targetValue, { column, record, index });
      };
    }

    if (column.type && allProcessors[column.type]) {
      processedColumn = { ...processedColumn, ...allProcessors[column.type](column) };
    }

    return processedColumn;
  });
}

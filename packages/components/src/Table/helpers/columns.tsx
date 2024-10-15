import { renderCurrencyColumn, renderNestedColumn, renderTimeColumns } from "./render"
import {ColumnPropsWithFormatTime, COLUMNTYPE, EnhanceColumnProps } from "../types"
import { getNestedValue } from "@react18-vite-antd-ts/utils"
import { ActionButton } from "./ActionButton"

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
import { Button } from 'antd';

type ColumnProcessor = (column: EnhanceColumnProps) => Partial<EnhanceColumnProps>;

const columnProcessors: Record<string, ColumnProcessor> = {
  [COLUMNTYPE.TIME]: (column) => ({
    render: (text: string) => renderTimeColumns(text, column.formatTime),
  }),
  [COLUMNTYPE.CURRENCY]: (column) => ({
    render: (text: number) => renderCurrencyColumn(text, column.formatTime),
  }),
  [COLUMNTYPE.ACTION]: (column) => ({
    title: '操作',
    render: (_, record) => {
      return <ActionButton
        {...column}
        record={record}
      />
    },
  }),
};

export function createExtensibleColumns(props: {
  columns: EnhanceColumnProps[]
  customProcessors?: Record<string, ColumnProcessor>
}) {
  const { columns, customProcessors = {} } = props;
  const allProcessors = { ...columnProcessors, ...customProcessors };

  return columns?.map((column) => {
    let processedColumn = { ...column, dataIndex: column.key };

    if (!column.actions && isNestedKey(column.key as string) && !column.render) {
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

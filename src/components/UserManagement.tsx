import type { CommonTableProps } from '@react18-vite-antd-ts/components'
import type { AdminContentLayoutRef, ToolBarProps } from '@react18-vite-antd-ts/types'
import { COLUMNTYPE } from '@react18-vite-antd-ts/components'
import { AdminContentLayout } from '@react18-vite-antd-ts/layouts'
import React, { useEffect, useRef } from 'react'

const UserManagement: React.FC = () => {
  const adminContentLayoutRef = useRef<AdminContentLayoutRef>(null)

  const toolCfg: ToolBarProps = {
    searchFormCfg: {
      searchFormProps: {
        url: '',
        formItems: [
          {
            type: 'input',
            name: 'name',
            label: '名字',
            placeholder: '请输入名字',
          },
          {
            type: 'number',
            name: 'age',
            label: '年龄',
            placeholder: '请输入年龄',
          },
          {
            type: 'input',
            name: 'address',
            label: '地址',
            placeholder: '请输入地址',
          },
          {
            type: 'select',
            name: 'company',
            label: '公司',
            placeholder: '请选择公司',
            options: [
              {
                label: '公司1',
                value: '1',
              },
            ],
          },
        ],
        initialValues: {
          age: 12,
        },
      },

      onBeforeSearch(searchFormValues) {
        console.log('searchFormValues', searchFormValues)
        return searchFormValues
      },
    },
    actionButtonCfg: {
      defaultActions: {
        add: {
          text: '添加用户',
          key: 'add',
          component_type: 'modal',
          requestUrl: '',
          requestData: {},
          formProps: {
            url: '',
            formItems: [
              {
                type: 'input',
                name: 'name',
                label: '名字',
                placeholder: '请输入名字',
              },
              {
                type: 'number',
                name: 'age',
                label: '年龄',
                placeholder: '请输入年龄',
              },
            ],
          },
        },
        upload: {
          key: 'upload',
          text: '上传',
          requestUrl: '/api/upload',
        },
        export: {
          key: 'export',
          text: '导出',
          requestUrl: '/api/export',
        },
      },
      extraActions: [
        {
          key: 'custom',
          component_type: 'drawer',
          text: '自定义',
          requestUrl: '',
          requestData: {},
          formProps: {
            url: '',
            formItems: [
              {
                type: 'input',
                name: 'name',
                label: '名字',
                placeholder: '请输入名字',
              },
              {
                type: 'number',
                name: 'age',
                label: '年龄',
                placeholder: '请输入年龄',
              },
            ],
          },
        },
        {
          key: 'upload',
          text: '自定义',
          component_type: 'drawer',
          requestUrl: '',
          requestData: {},
          render: () => {
            console.log('123123')
            return <div>自定义内容</div>
          },
        },
      ],
    },
  }

  // Define your table columns and data here
  const dataCfg: CommonTableProps['dataCfg'] = {
    getUrl: 'https://jsonplaceholder.typicode.com/users',
    columns: [
      {
        title: 'id',
        key: 'id',
      },
      {
        title: '名字',
        key: 'name',
      },
      {
        title: '公司',
        key: 'company.name',
      },
      {
        type: COLUMNTYPE.TIME,
        title: '创建时间',
        key: 'createTime',
      },
      {
        title: '精度',
        key: 'address.geo.lat',
      },
      {
        title: '纬度',
        key: 'address.geo.lng',
      },
      {
        type: COLUMNTYPE.ACTION,
        maxVisible: (_, index) => {
          return index % 2 === 0 ? 1 : 4
        },
        defaultActionCfg: {
          viewCfg: {
            text: (record) => {
              return `查看${record.id}`
            },
          },
          editCfg: {
            text: (record, index) => {
              return `编辑${record.id}${index + 3}`
            },
            onBeforeSubmit(record) {
              return {
                ...record,
              }
            },
          },
          deleteCfg: {
            text: (record, index) => {
              return `删除${record.id}${index}`
            },
            onBeforeSubmit(record) {
              return {
                ...record,
              }
            },
          },
        },
        actions: [
          {
            text: (record) => {
              return `自定义渲染${record.id}`
            },
            danger: true,
            hidden: (record) => {
              return record.id % 2 === 0
            },
            onClick: (record) => {
              console.log('record', record)
            },
          },
        ],
      },
    ],
  }

  useEffect(() => {
    console.log('adminContentLayoutRef', adminContentLayoutRef.current?.getSearchFormRef())
  }, [])

  return <AdminContentLayout ref={adminContentLayoutRef} dataCfg={dataCfg} toolCfg={toolCfg} />
}

export default UserManagement

import One from '@/assets/1.svg'
/**
 * 这里是一段对该页面的描述
 *
 * @description 首页
 */
import { Avatar, Card, Col, List, Progress, Row, Space, Statistic, Typography } from 'antd'
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const { Text } = Typography

const data = [
  { hour: '00:00', uv: 4000, pv: 2400 },
  { hour: '03:00', uv: 3000, pv: 1398 },
  { hour: '06:00', uv: 2000, pv: 9800 },
  { hour: '09:00', uv: 2780, pv: 3908 },
  { hour: '12:00', uv: 1890, pv: 4800 },
  { hour: '15:00', uv: 2390, pv: 3800 },
  { hour: '18:00', uv: 3490, pv: 4300 },
  { hour: '21:00', uv: 3490, pv: 4300 },
]

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function Dashboard() {
  return (
    <div className="p-1rem">
      <Card style={{ marginBottom: '20px', padding: '15px' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space align="center">
            <Avatar src="https://avatars.githubusercontent.com/u/88939906?v=4" size={70} />
            <Space direction="vertical">
              <Text className="font-semibold text-18px">早安, 风之兮原, 今天又是充满活力的一天!</Text>
              <Text type="secondary" style={{ fontSize: '14px' }}>今天多云转晴, 20°C - 25°C!</Text>
            </Space>
          </Space>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <Space size={30}>
              <Space direction="vertical" style={{ textAlign: 'left' }}>
                <span className="text-14px">项目数</span>
                <span className="text-24px">25</span>
              </Space>
              <Space direction="vertical" style={{ textAlign: 'left' }}>
                <span className="text-14px">待办</span>
                <span className="text-24px">4/16</span>
              </Space>
              <Space direction="vertical" style={{ textAlign: 'left' }}>
                <span className="text-14px">消息</span>
                <span className="text-24px">12</span>
              </Space>
            </Space>
          </div>
        </Space>
      </Card>
      <Row gutter={16}>
        <Col span={6}>
          <Card
            style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(236, 71, 134), rgb(185, 85, 164))', height: '100%' }}
          >
            <Statistic
              title={<div style={{ color: 'white', fontSize: '18px' }}>访问量</div>}
              value={9725}
              prefix="$"
              valueStyle={{ color: 'white', fontSize: '28px', textAlign: 'right' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(134, 94, 192), rgb(81, 68, 180))' }}>
            <Statistic title={<div style={{ color: 'white', fontSize: '18px' }}>收入</div>} value={1026} prefix="$" valueStyle={{ color: 'white', fontSize: '28px', textAlign: 'right' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(86, 205, 243), rgb(113, 157, 227))' }}>
            <Statistic title={<div style={{ color: 'white', fontSize: '18px' }}>下载量</div>} value={970925} valueStyle={{ color: 'white', fontSize: '28px', textAlign: 'right' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(252, 188, 37), rgb(246, 128, 87))' }}>
            <Statistic title={<div style={{ color: 'white', fontSize: '18px' }}>活跃用户</div>} value={9527} valueStyle={{ color: 'white', fontSize: '28px', textAlign: 'right' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={16}>
          <Card title="访问趋势" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#1677FF" fill="#1677FF" />
                <Area type="monotone" dataKey="pv" stroke="#FF5733" fill="#FF5733" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="任务完成率" style={{ height: '100%' }}>
            <PieChart width={200} height={250}>
              <Pie data={pieData} cx={100} cy={100} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <Progress percent={75} status="active" />
          </Card>
        </Col>
      </Row>
      {/* 在这下面添加 */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={16}>
          <Card title="项目动态" extra={<a href="#">更多动态</a>}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: '风之兮原 创建了开源项目 react18-vite-antd-ts-admin!',
                  avatar: 'https://avatars.githubusercontent.com/u/88939906?v=4',
                  datetime: '2021-05-28 22:22:22',
                },
                {
                  title: 'Yanbowe 向 react18-vite-antd-ts-admin 提交了一个bug，多标签栏不会自适应。',
                  avatar: 'https://avatars.githubusercontent.com/u/88939906?v=4',
                  datetime: '2021-10-27 10:24:54',
                },
                {
                  title: '风之兮原 准备为 react18-vite-antd-ts-admin 的发布做充分的准备工作！',
                  avatar: 'https://avatars.githubusercontent.com/u/88939906?v=4',
                  datetime: '2021-10-31 22:43:12',
                },
                {
                  title: '风之兮原 正在忙于为react18-vite-antd-ts-admin写项目说明文档！',
                  avatar: 'https://avatars.githubusercontent.com/u/88939906?v=4',
                  datetime: '2021-11-03 20:33:31',
                },

              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.title}
                    description={item.datetime}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8} style={{ height: '100%' }}>
          <Card title="创意" style={{ height: '100%' }}>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <img src={One} height={200} alt="1" style={{ textAlign: 'center' }} />
              <span style={{ color: '#999', fontSize: '18px', fontStyle: 'italic' }}>No Empty</span>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

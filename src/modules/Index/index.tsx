/**
 * 这里是一段对该页面的描述
 *
 * @author 风之兮原
 * @description 首页
 */
import { Card, Col, Progress, Row, Statistic } from 'antd'
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

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
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="访问量" value={9725} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="收入" value={1026} prefix="$" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="下载量" value={970925} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="活跃用户" value={9527} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={16}>
          <Card title="访问趋势">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="任务完成率">
            <PieChart width={200} height={200}>
              <Pie data={pieData} cx={100} cy={100} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <Progress percent={75} status="active" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

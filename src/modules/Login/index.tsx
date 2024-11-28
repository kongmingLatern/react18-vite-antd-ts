/**
 * 这里是一段对该页面的描述
 *
 * @author 风之兮原
 * @description 登录
 */
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // 在这里处理登录逻辑
    // 登录成功后跳转到仪表板
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login

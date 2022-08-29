import { Button, Result } from 'antd';
import {useNavigate} from 'react-router-dom'

function Missing() {

  const navigate = useNavigate();

  return (
    <div style={{width: '100%', height: '100%', display: 'flex',  justifyContent: 'center', alignItems:'center'}}>
      <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => navigate("/login")}>Back Home</Button>}
    />
    </div>
    
  )
}

export default Missing
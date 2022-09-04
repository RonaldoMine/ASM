import { Button, Result } from 'antd';
import {useNavigate} from 'react-router-dom'

function Unauthorized() {

  const navigate = useNavigate();

  return (
      <div style={{width: '100%', height: '100%', display: 'flex',  justifyContent: 'center', alignItems:'center'}}>
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => navigate("/")}>Back Home</Button>}
        />
      </div>

  )
}

export default Unauthorized
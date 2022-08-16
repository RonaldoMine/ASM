import {Avatar} from "antd";
import {Typography} from "antd";
import useAuth from "../../../../auth/hook/useAuth";

const  { Title } = Typography;

function Account() {
    const { auth } = useAuth();
    console.log(auth)
    return <>
        <Avatar src="https://joeschmoe.io/api/v1/random" /> <br/>
        <small>{ auth.username} </small>
        <p>Agence : { auth.agency} </p>
        <p>Département : { auth.department} </p>
    </>;
}
export default Account;
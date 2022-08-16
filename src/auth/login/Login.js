import { Button, Form, Input, message } from 'antd'
import './Login.css';
import logo from '../../assets/logoAFB.png';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import axios from 'axios'
import {API_USER_URL} from "../../global/axios";


function Login() {

    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [form] = Form.useForm()

    const from = location.state?.from?.pathname || `/`;

    //Hooks
    const onFinish = async() => {

        const name = form.getFieldValue('username');
        const pass = form.getFieldValue('password');

        try {
            const response = await axios.post(API_USER_URL+"auth/signin", { username: name, password: pass },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const { username, email, agency, role, department } = response?.data
            signIn({ username, email, agency, role, department });
            navigate(`/admin/general/tickets`, { replace: true });
        } catch (err) {
            if (!err?.response) {
                message.error("Aucune réponse du serveur")
            } else if (err.response?.status === 400) {
                message.info('Mauvaise requête');
            } else if (err.response?.status === 401) {
                message.info('Non autorisé');
            } else {
                message.error('Erreur de connexion');
            }
        }
    }

    return (
        <section className='login-container'>
            <div className='login-form-container'>
                <div className='login-form__logo'>
                    <img src={logo} alt="Logo Afriland" width={120} height={96} />
                </div>
                <div className='login-form-wrapper'>
                    <Form
                        name="login"
                        layout='vertical'
                        form={form}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Nom d'utilisateur"
                            name="username"
                            rules={[{ required: true, message: 'Insérez votre nom d\'utilisateur!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mot de passe"
                            name="password"
                            rules={[{ required: true, message: 'Insérez votre mot de passe!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit" className='login-form__submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <p className='login-form__footer'>
                    Afriland First Bank Cameroun (C) - 2022
                </p>
            </div>
        </section>


    )
}

export default Login
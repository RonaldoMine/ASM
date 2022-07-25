import { Button, Form, Input } from 'antd'
import './Login.css';
import logo from '../../assets/logoAFB.png';
import { Link } from 'react-router-dom';


function Login() {

    //Hooks
    const onFinish = (values) => {
        console.log(values)
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
                            Or <Link to="">register now!</Link>
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
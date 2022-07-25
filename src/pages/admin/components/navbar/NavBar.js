//imports
import React, { useState } from 'react'
import { Button, Form, Input, Layout, message, Modal, Select } from 'antd'
import { Menu } from 'antd'
import './NavBar.css';
import logo from '../../../../assets/logoAFB.png';
import { NavBarData } from './NavBarData';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAddTickets } from '../../feature/hooks/useAddTickets';

//instanciations
const { Header } = Layout;
const { Option } = Select;



//Navbar data
const items1 = NavBarData.map(elmt => ({
    key: elmt.key,
    itemIcon: elmt.icon,
}));

const NavBar = () => {

    //Functions
    const handleCancel = () => {
        if(form.isFieldsTouched(["title", "description"])){
            Modal.confirm({
                title: 'Annuler la création de ticket',
                icon: <ExclamationCircleOutlined />,
                content: 'Voulez-vous continuez et perdre ces changements ?',
                okText: 'Oui',
                style: {position: 'relative', top: 'calc(100vh - 68%)'},
                cancelText: 'Non',
                onOk: () => {
                    form.resetFields()
                    setIsOpen(false);
                },
                onCancel: () => {
                    setIsOpen(true);
                }
            }); 
        } else {
            form.resetFields()
            setIsOpen(false)
        }
        
    };

    //Create Ticket
    const handleCreate = () => {
        setConfirmLoading(true);
        form.validateFields()
        .then(value => {
            addTicket({ ...value, resolved: "false", closed_at: "" });
            form.resetFields()
            setIsOpen(false);
            setConfirmLoading(false);
        }).catch(() => {
            message.error("Ticket non créé");
            setConfirmLoading(false);
        })
        
        

    };

    //Hooks
    //State for modal component
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { mutate: addTicket } = useAddTickets();

    return (
        <Header className="header-container" /*style={{ position: 'fixed', zIndex: 1, width: '100%' }}*/>

            {/*Header left side */}
            <div className="header_left">
                <img src={logo} alt="Logo Afriland" width={50} height={40} />
                <span className='header_left_company-name'>Afriland First Bank</span>

                <Button type='primary' className='header_left_create-button'
                    onClick={() => setIsOpen(true)}
                >Créer un ticket</Button>
            </div>

            {/*Modal */}

            <Modal cancelText={"Annuler"} okText={"Créer"} visible={isOpen} onCancel={handleCancel} onOk={handleCreate} confirmLoading={confirmLoading}>
                <Form
                    name="create_ticket"
                    layout='vertical'
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Intitulé"
                        name="title"
                        rules={[{ required: true, message: 'Insérez un intitulé!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Insérez une description!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Émetteur"
                        name="reporter"
                        initialValue={"Moi"}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Attribuer à"
                        name="assignee"
                        initialValue={"Auto-assign"}
                    >
                        <Select >
                            <Option value="Auto-assign">
                                Auto-assign
                            </Option>
                            <Option value="Agent1">
                                Agent1
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Statut"
                        name="status"
                        initialValue={"Nouveau"}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Priorité"
                        name="priority"
                        initialValue={"Normal"}
                    >
                        <Select >
                            <Option value="Normal">
                                Normal
                            </Option>
                            <Option value="Moyen">
                                Moyen
                            </Option>
                            <Option value="Important">
                                Important
                            </Option>
                            <Option value="Urgent">
                                Urgent
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Catégorie"
                        name="category"
                        initialValue={"Application"}
                    >
                        <Select >
                            <Option value="Infrastructure">
                                Infrastructure
                            </Option>
                            <Option value="Réseau">
                                Réseau
                            </Option>
                            <Option value="Sécurité">
                                Sécurité
                            </Option>
                            <Option value="Application">
                                Application
                            </Option>
                            <Option value="Automate">
                                Automate
                            </Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
            {/*Modal */}

            {/*Header right side */}
            <Menu items={items1} theme="light" mode="horizontal"
                className="header_right" />

        </Header>
    )
}

export default NavBar
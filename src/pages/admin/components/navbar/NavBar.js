//imports
import React, {useEffect, useState} from 'react'
import {Avatar, Button, Form, Input, Layout, message, Modal, Select, Space, TreeSelect} from 'antd'
import './NavBar.css';
import logo from '../../../../assets/logoAFB.png';
import {bellMenu, profileMenu} from './NavBarData';
import {BellFilled, ExclamationCircleOutlined, UserOutlined} from '@ant-design/icons';
import {useAddTickets} from '../../feature/hooks/useAddTickets';
import CustomDropdown from './DropdownAccount/CustomDropdown';
import useAuth from '../../../../auth/hook/useAuth';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../../../../global/axios";
import {useQuery} from "react-query";

//instanciations
const {Header} = Layout;
const {Option} = Select;


//Functions
const fetchCategories = () => {
    return axios.get(API_URL + "tickets/categories/parent")
}

const NavBar = () => {

    //Hooks
    //State for modal component
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [valueTreeCategories, setValueTreeCategories] = useState();
    const {mutate: addTicket} = useAddTickets();
    const {auth, signOut} = useAuth();
    const navigate = useNavigate();
    const [treeData, setTreeData] = useState([]);
    const {data: categories} = useQuery("categorieslist", fetchCategories)

    useEffect(() => {
        setTreeData(categories?.data.map((category) => {
            return {
                id: category.categoryId,
                title: category.name,
                value: category.categoryId,
                pId: category.level,
                isLeaf: true,
            };
        }))
    }, [categories])

    const handleCancel = () => {
        if (form.isFieldsTouched(["title", "description"])) {
            Modal.confirm({
                title: 'Annuler la création de ticket',
                icon: <ExclamationCircleOutlined/>,
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

    //Create ticket
    const handleCreate = () => {
        setConfirmLoading(true);
        form.validateFields()
            .then(value => {
                addTicket({...value, resolved: "false", closed_at: ""});
                form.resetFields()
                setIsOpen(false);
                setConfirmLoading(false);
            }).catch(() => {
            message.error("ticket non créé");
            setConfirmLoading(false);
        })
    };

    const genTreeNode = (parentId, isLeaf = false) => {
        const random = Math.random().toString(36).substring(2, 6);
        return {
            id: random,
            pId: parentId,
            value: random,
            title: isLeaf ? 'Tree Node' : 'Expand to load',
            isLeaf,
        };
    };

    const onLoadData = ({id}) =>
        new Promise((resolve) => {
            setTreeData(
                treeData.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]),
            );
            resolve(undefined);
        });

    const onChange = (newValue) => {
        console.log(newValue);
        setValueTreeCategories(newValue);
    };

    return (
        <Header className="header-container" /*style={{ position: 'fixed', zIndex: 1, width: '100%' }}*/>
            {/*Header left side */}
            <div className="header_left">
                <img src={logo} alt="Logo Afriland" width={50} height={40}/>
                <span className='header_left_company-name'>Afriland First Bank</span>

                <Button type='primary' className='header_left_create-button'
                        onClick={() => setIsOpen(true)}
                >Créer un ticket</Button>
            </div>

            {/*Modal */}

            <Modal cancelText={"Annuler"} okText={"Créer"} visible={isOpen} onCancel={handleCancel} onOk={handleCreate}
                   confirmLoading={confirmLoading}>
                <Form
                    name="create_ticket"
                    layout='vertical'
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Intitulé"
                        name="title"
                        rules={[{required: true, message: 'Insérez un intitulé!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{required: true, message: 'Insérez une description!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Émetteur"
                        name="reporter"

                        initialValue={"Yvan Dipoko"}
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Attribuer à"
                        name="assignee"
                        initialValue={"Auto-assign"}
                    >
                        <Select>
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
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Département"
                        name="department"
                        initialValue={"DSI"}
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Priorité"
                        name="priority"
                        initialValue={"Normal"}
                    >
                        <Select>
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
                    >
                        {/*<Select >
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
                        </Select>*/}
                        <TreeSelect
                            treeDataSimpleMode
                            style={{width: '100%'}}
                            value={valueTreeCategories}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="Please select"
                            onChange={onChange}
                            loadData={onLoadData}
                            treeData={treeData}
                        />
                    </Form.Item>

                </Form>
            </Modal>
            {/*Modal */}

            {/*Header right side */}
            {/* <Menu items={items1} theme="light" mode="horizontal"
                className="header_right" /> */}

            <Space size={"large"}>
                <CustomDropdown menuDatas={bellMenu} icon={<BellFilled style={{fontSize: "22px"}}/>}/>
                <CustomDropdown menuDatas={profileMenu(auth, signOut, navigate)}
                                icon={<Avatar style={{marginBottom: '8px'}} icon={<UserOutlined/>}/>}/>
            </Space>
        </Header>
    )
}

export default NavBar
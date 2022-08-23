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
const fetchSubCategories = (categoryID) => {
    return axios.get(API_URL + "tickets/categories/" + categoryID + "/subcategories")
}

function onLoadData (id, dataIdIsLoaded, setDataIsIsLoaded, genTreeNode, treeData, setTreeData){
    console.log(id)
    return new Promise((resolve) => {
        if (!dataIdIsLoaded.includes(id)){
            setDataIsIsLoaded([...dataIdIsLoaded, id]);
            const data = fetchSubCategories(id);
            data.then((data) => {
                let newCategories = data.data.map((category) => {
                    return genTreeNode(category);
                })
                setTreeData([...treeData, ...newCategories]);
            }).finally(() => {
                resolve(null);
            });
        }else{
            console.log('Le mec existe déjà');
            resolve(null);
        }
    });
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
    const [dataIdIsLoaded, setDataIsIsLoaded] = useState([]);
    //const {data: categories} = useQuery("categorieslist", fetchCategories, {onSuccess: (data) => setTreeData(data?.data.map((category) => genTreeNode(category)))})
    const {data: categories} = useQuery("categorieslist", fetchCategories)

    useEffect(() => {
        setTreeData(categories?.data.map((category) => genTreeNode(category)))
        setDataIsIsLoaded([]);
    }, [categories]);


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
                addTicket({...value, category: value.category.toString(), type: "0", resolved: "false", closed_at: ""});
                form.resetFields()
                setIsOpen(false);
                setConfirmLoading(false);
            }).catch(() => {
            message.error("ticket non créé");
            setConfirmLoading(false);
        })
    };

    const genTreeNode = ({parent, categoryId, name, hasChild}) => {
        return {
            id: categoryId,
            pId: parent,
            value: categoryId,
            title: name,
            isLeaf: !hasChild
        };
    };

    const onChange = (value, label, extra) => {
        console.log(extra);
        setValueTreeCategories(label[0]);
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
                            placeholder="Choisir la catégories"
                            onChange={onChange}
                            loadData={({id}) => onLoadData(id, dataIdIsLoaded, setDataIsIsLoaded, genTreeNode, treeData, setTreeData)}
                            treeData={treeData}
                            //treeLoadedKeys={[]}
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
//imports
import React, {useMemo, useRef, useState} from 'react'
import {Avatar, Button, Form, Input, Layout, message, Modal, Select, Space, Spin, TreeSelect} from 'antd'
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
import {TICKET_LABEL_UNASSIGNED} from "../../../../global/statusTickets";
import {ROLE_AGENT} from "../../../../global/roles";
import debounce from 'lodash/debounce';

//instanciations
const {Header} = Layout;
const {Option} = Select;

//Functions
const fetchCategories = () => {
    return axios.get(API_URL + "tickets/categories/parent")
}

function DebounceSelect({fetchOptions, debounceTimeout = 800, ...props}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
            options={options}
        />
    );
}

function fetchIncidentList(title) {
    return axios.get(API_URL + 'incidents/filter-by-title?title=' + title)
        .then((body) =>
            body.data.map((incident) => ({
                label: `${incident.title}`,
                value: incident.id,
            })),
        );
}

const NavBar = () => {

    //Hooks
    //State for modal component
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [categoryTreeValue, setcategoryTreeValue] = useState();
    const [treeSelectOpen, setTreeSelectOpen] = useState(false);
    const [typeTicket, setTypeTicket] = useState(0);
    const [incidents, setIncidents] = useState([]);
    const {mutate: addTicket} = useAddTickets();
    const {auth, signOut} = useAuth();
    const navigate = useNavigate();
    const [treeData, setTreeData] = useState([]);

    useQuery("categorieslist", fetchCategories, {
        onSuccess: (data) => {
            setTreeData(data?.data.map((category) => genTreeNode(category)))
        }
    })

    const checkSubTree = (id) => {
        let matches = [];
        matches = treeData.filter((value) => value.pId === id)

        return matches.length > 0
    }
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
                let incidents = value.incidents?.map((incident) => incident.value)
                addTicket({
                    ...value,
                    category: value.category.toString(),
                    assigned_to: TICKET_LABEL_UNASSIGNED,
                    source: auth.agency,
                    reporter: auth.username,
                    status: 'Nouveau',
                    incidents : incidents,
                    type: auth.role === ROLE_AGENT ? 0 : value.type
                });
                form.resetFields()
                setIsOpen(false);
                setConfirmLoading(false);
                setIncidents([]);
                setTypeTicket(0);
                message.success("Ticket créé avec succès");
            }).catch((error) => {
                console.log(error)
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

    const onChange = (newValue) => {
        setcategoryTreeValue(newValue);
    };

    const onLoadData = ({id}) =>
        new Promise((resolve) => {
            if (treeSelectOpen && !checkSubTree(id)) {
                fetch(API_URL + "tickets/categories/" + id + "/subcategories").then(
                    res => res.json()
                ).then(
                    data => {
                        let arr = [];
                        for (let d of data) {
                            arr.push(genTreeNode(d))
                        }
                        resolve(setTreeData(treeData.concat(arr)));
                    }
                )
            } else {
                resolve();
            }

        });

    return (
        <Header className="header-container" /*style={{ position: 'fixed', zIndex: 1, width: '100%' }}*/>
            {/*Header left side */}
            <div className="header_left">
                <img src={logo} alt="Logo Afriland" width={50} height={40}/>
                <span className='header_left_company-name'>Afriland First Bank</span>

                <Button type='primary' className='header_left_create-button'
                        onClick={() => {
                            setTypeTicket(0);
                            setIncidents([]);
                            setIsOpen(true)
                        }}
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
                        label="Type de Ticket"
                        name="type"
                        initialValue={auth.role === ROLE_AGENT ? 'Incident' : '0'}
                        rules={[{required: true, message: 'Choisr un type!'}]}
                    >
                        {
                            auth.role === ROLE_AGENT ? <Input disabled={true}/> :
                                <Select onChange={(value) => setTypeTicket(parseInt(value))}>
                                    <Option value="0">
                                        Incident
                                    </Option>
                                    <Option value="1">
                                        Problème
                                    </Option>
                                </Select>
                        }
                    </Form.Item>
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
                        label="Département"
                        name="department"
                        initialValue={auth.department}
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Priorité"
                        name="priority"
                        initialValue={"0"}
                    >
                        <Select>
                            <Option value="0">
                                Normal
                            </Option>
                            <Option value="1">
                                Moyen
                            </Option>
                            <Option value="2">
                                Important
                            </Option>
                            <Option value="3">
                                Urgent
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Catégorie"
                        name="category"
                        rules={[{required: true, message: 'Choisir une catégorie!'}]}
                    >
                        <TreeSelect
                            treeDataSimpleMode
                            style={{width: '100%'}}
                            value={categoryTreeValue}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="Choisir la catégorie"
                            onChange={onChange}
                            loadData={onLoadData}
                            treeData={treeData}
                            onDropdownVisibleChange={(open) => setTreeSelectOpen(open)}
                        />
                    </Form.Item>

                    {typeTicket === 1 && <Form.Item label={"Incidents"} name={"incidents"} initialValue={incidents}>
                        <DebounceSelect
                            mode="multiple"
                            value={"value"}
                            placeholder="Selectionner un ou plusieurs incidents"
                            fetchOptions={fetchIncidentList}
                            onChange={(newValue) => {
                                setIncidents(newValue);
                            }}
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>}

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